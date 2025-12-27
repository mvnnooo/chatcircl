export interface User{ id:string; name:string; email:string; status:string }
export interface Message{ id:string; content:string; createdAt:number }
export interface Room{ id:string; name:string }
export interface Call{ id:string; type:'audio'|'video' }
export interface TypingIndicator{ userId:string; roomId:string }