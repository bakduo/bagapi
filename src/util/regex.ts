
export const extractNameFileFromHeader = (payload:string) => {

    if (payload.split(';').length==2){
        if (payload.split(';')[1].split('=').length==2){
            return payload.split(';')[1].split('=')[1].replace(/"/g,'');
        }
    }
    throw Error('Header filename incompatible');
}
