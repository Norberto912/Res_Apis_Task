/*import {CorsOptions} from 'cors'

export const corsConfig: CorsOptions={
    origin: function(origin, callback){
        const whilelist= [process.env.FRONTEND_URL]

        if(whilelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}*/

import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {

       
        
        const whitelist = [process.env.FRONTEND_URL]

        if(process.argv[2]==='-api'){
            whitelist.push(undefined)
        }

        // Permitir si no hay 'origin' o si coincide con la lista blanca
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}