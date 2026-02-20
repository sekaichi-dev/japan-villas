import re
import os

files = [
    'guidebook-lake-house.html', 'js/guidebook-lake-house.js',
    'guidebook-lakeside-inn.html', 'js/guidebook-lakeside-inn.js',
    'guidebook-mv-niseko.html', 'js/guidebook-mv-niseko.js'
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix lakesideinn/ inside data-img
    content = re.sub(r'data-img="lakesideinn/([\w.]+)"', r'data-img="\1"', content)
    
    # 2. Fix lake_house/ inside data-img (just in case)
    content = re.sub(r'data-img="lake_house/([\w.]+)"', r'data-img="\1"', content)

    # 3. Cache busting bump
    content = re.sub(r'\.js\?v=\d+', r'.js?v=3', content)
    content = re.sub(r'\.js"', r'.js?v=3"', content)
    # in case it became .js?v=3?v=3" due to regex overlap:
    content = content.replace('?v=3?v=3', '?v=3')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Fixed {file_path}")
