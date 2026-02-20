import re
import os

configs = [
    {
        'base': 'img/lake_house/',
        'files': ['guidebook-lake-house.html', 'js/guidebook-lake-house.js']
    },
    {
        'base': 'img/lakeside_inn/',
        'files': ['guidebook-lakeside-inn.html', 'js/guidebook-lakeside-inn.js']
    },
    {
        'base': 'img/mv_niseko/',
        'files': ['guidebook-mv-niseko.html', 'js/guidebook-mv-niseko.js']
    }
]

for config in configs:
    base_val = config['base']
    files = config['files']
    
    for file_path in files:
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Step 1: Replace src="...img/...filename" with data-img="filename"
        # Handles single and double quotes, and optional path prefixes before filename
        content = re.sub(
            r'src=(["\'])(?:\./)?img/(?:lake_house/|lakeside_inn/|mv_niseko/)?([^"\']+\.(?:jpg|png|jpeg|JPG|PNG|JPEG))\1',
            r'data-img="\2"',
            content
        )
        
        # Also replace src="${...}" where it represents an image
        content = re.sub(
            r'src=(["\'])\$\{([^}]+)\}\1',
            r'data-img="${\2}"',
            content
        )
        
        # Step 2: Fix JS string literals that contain paths like "img/lake_house_main.jpg"
        # We only want the filename. We assume it's like "img/..." or "./img/...".
        content = re.sub(
            r'([:=>,]\s*)(["\'])(?:\./)?img/(?:lake_house/|lakeside_inn/|mv_niseko/)?([^"\']+\.(?:jpg|png|jpeg|JPG|PNG|JPEG))\2',
            r'\1"\3"',
            content
        )

        if file_path.endswith('.js'):
            # Step 3: Insert IMG_BASE at the top
            if 'const IMG_BASE' not in content:
                content = f"const IMG_BASE = '{base_val}';\n" + content
            
            # Step 4: Insert resolveImages() function and call it on DOMContentLoaded
            if 'function resolveImagePaths()' not in content:
                resolve_func = """
function resolveImagePaths() {
    document.querySelectorAll('img[data-img]').forEach(img => {
        img.src = IMG_BASE + img.getAttribute('data-img');
    });
}
"""
                # Add function definition to the top (after IMG_BASE)
                content = content.replace(f"const IMG_BASE = '{base_val}';\n", f"const IMG_BASE = '{base_val}';\n{resolve_func}")
                
                # Append resolveImagePaths() calls inside DOMContentLoaded
                content = re.sub(
                    r'(document\.addEventListener\([\'"]DOMContentLoaded[\'"],\s*\(\)\s*=>\s*\{)',
                    r'\1\n    resolveImagePaths();',
                    content
                )
                
                # Append resolveImagePaths() after renderGuidebook() to catch any dynamically rendered images
                content = re.sub(
                    r'(renderGuidebook\(\);)',
                    r'\1\n    resolveImagePaths();',
                    content
                )
                
            # Step 5: Update heroImage to append IMG_BASE in renderPropertyInfo
            content = re.sub(
                r'heroImage\.src\s*=\s*guidebookData\.heroImage;',
                r'heroImage.src = IMG_BASE + guidebookData.heroImage;',
                content
            )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {file_path}")
