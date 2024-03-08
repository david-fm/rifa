import { persistentAtom, persistentMap } from '@nanostores/persistent'
import type {baseUser, creadorInfo} from './types/localStorage'


export const $token = persistentAtom<string>('token','')
export const $refreshToken = persistentAtom<string>('refresh','')

// timeToken is the time when the token was created
export const $timeToken = persistentAtom<number>('timeToken',0,{
    encode: String,
    decode: Number
})

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
    support_link: null
},{
    encode: JSON.stringify,
    decode: JSON.parse

})

export const $buying = persistentAtom<string>('buying', '')