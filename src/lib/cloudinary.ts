import cloudinary from "../configs/cloudinary"
import { ApiError, FileUploadError } from "./error";
import { StatusCode } from "./mock-response";

type Params = {
    path: string;
    public_id: string;
}

export async function cloudinaryUpload(params: Params) {
    const { url, public_id } = await cloudinary.uploader.upload(params.path,
        {
            public_id: params.public_id, transformation:
                { fetch_format: "webp", quality: "auto" }
        })
        .catch((err) => {
            throw new FileUploadError(StatusCode.BAD_REQUEST, JSON.stringify(err))
        })

    return { url, public_id }
}

export async function cloudinaryDestroy({ public_id }: Pick<Params, "public_id">) {
    await cloudinary.uploader.destroy(public_id)
        .catch((err) => {
            throw new ApiError(StatusCode.BAD_REQUEST, JSON.stringify(err))
        })
}


export function getPublicId(url: string) {
    const { pathname } = new URL(url)

    const pathnameArr = pathname.split("/")
    const lastArr = pathnameArr[pathnameArr.length - 1]

    const publicId = lastArr.split(".")[0]

    return publicId
}