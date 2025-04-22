import { UUID } from "crypto"
import { ChatParameters } from "./ChatParameters"

export  type ChatConfig = ChatParameters  & { ownerId:UUID | null }