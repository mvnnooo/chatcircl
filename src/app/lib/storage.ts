export const saveCurrentUser=(u:any)=>localStorage.setItem('circl_current_user',JSON.stringify(u));
export const getCurrentUser=()=>JSON.parse(localStorage.getItem('circl_current_user')||'null');