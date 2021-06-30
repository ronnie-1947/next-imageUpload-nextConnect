import fs from 'fs'
import path from 'path'

import nextConnect from 'next-connect'
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next'

const dataPath = path.join(process.cwd(), 'data', 'data.json')

type extendedReq = NextApiRequest & {
    file: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        destination: string,
        filename: string,
        path: string,
        size: number
    }
}

// Returns a Multer instance that provides several methods for generating 
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
    fileFilter: (req:any, file: {mimetype:string}, cb:any)=>{
        if(file.mimetype.toLowerCase() ==='image/jpeg' || file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype === 'image/webp'){
            cb(null, true);
        }else{
            cb(new Error('Invalid file type'));
        }
    }
})

const apiRoute = nextConnect<extendedReq, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    },
})

// Returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.single('file')

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware)

apiRoute.post((req, res) => {

    const {filename} = req.file
    const uri = `/uploads/${filename}`

    fs.writeFileSync(dataPath, JSON.stringify({uri}))

    res.status(200).json({ uri })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}