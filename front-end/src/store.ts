import { persistentAtom, persistentMap } from '@nanostores/persistent'
import type {baseUser, creadorInfo} from './types/localStorage'


export const $token = persistentAtom<string>('token','')
export const $refreshToken = persistentAtom<string>('refresh','')
export const $isCreador = persistentAtom<boolean>('isCreador', false,{
    encode: JSON.stringify,
    decode: JSON.parse

})

export const $baseUser = persistentMap<baseUser>('baseUser', {
    username: null,
    email: null
}, 
{
    encode: JSON.stringify,
    decode: JSON.parse

})

export const $creadorInfo = persistentMap<creadorInfo>('creadorInfo', {
    logo: null,
    support_link: null,
    support_type: 0
},{
    encode: JSON.stringify,
    decode: JSON.parse

})