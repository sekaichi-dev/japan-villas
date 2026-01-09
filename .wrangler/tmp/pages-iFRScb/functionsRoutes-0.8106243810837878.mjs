import { onRequest as __api_availability_js_onRequest } from "/Users/tenichiliu/Desktop/AntiGravity/functions/api/availability.js"
import { onRequest as __api_price_js_onRequest } from "/Users/tenichiliu/Desktop/AntiGravity/functions/api/price.js"
import { onRequest as __api_properties_js_onRequest } from "/Users/tenichiliu/Desktop/AntiGravity/functions/api/properties.js"

export const routes = [
    {
      routePath: "/api/availability",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_availability_js_onRequest],
    },
  {
      routePath: "/api/price",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_price_js_onRequest],
    },
  {
      routePath: "/api/properties",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_properties_js_onRequest],
    },
  ]