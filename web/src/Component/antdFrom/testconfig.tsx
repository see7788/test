import z from "zod"
export interface ml_t {
    id: number
    id_parent: number
    name: string
    json: { remrk?: string }
    uptimestamp: string
}
export const emptyData: ml_t = {
    id: 1,
    id_parent: 1,
    name: "",
    json: {
        remrk:"xxxxxxxxxxxxxxxxxx"
    },
    uptimestamp: ""
  }
export const zobj = z.object({
    id: z.number(),
    id_parent: z.number(),
    name: z.string().min(1),
    json: z.object({
        remark: z.string().optional()
    }),
    uptimestamp: z.string().min(1)
})