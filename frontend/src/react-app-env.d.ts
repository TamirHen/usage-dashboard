/// <reference types="react-scripts" />
declare global {
   namespace NodeJS {
      interface ProcessEnv {
         REACT_APP_BACKEND_BASE_URL: string
         REACT_APP_USAGE_PATH: string
      }
   }
}

export {}
