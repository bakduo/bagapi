export interface IMessageAsync {
    sendMessage(body:unknown):boolean,
    recieveMessage(callback:Function):Promise<unknown>,
}