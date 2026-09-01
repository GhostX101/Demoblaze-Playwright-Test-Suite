import{test, expect} from '@playwright/test'
export class loginpage{
    constructor(page){
        this.page = page 
    }
clickonlogin(){
    return this.page.locator('#login2').click();
}
setusername(username){
    return this.page.locator('#loginusername').fill(username)

}
setpassword(password){
    return this.page.locator('#loginpassword').fill(password)
}

async clickBtn(){
    return this.page.locator("button[onclick='logIn()']").click()
}

setusername1(){
    return this.page.locator('#loginusername')

}
setpassword2(){
    return this.page.locator('#loginpassword')
}

clickBtn1(){
    return this.page.locator("button[onclick='logIn()']")
}



}