import{test, expect} from '@playwright/test'
export class HomePage{
    constructor(page){
        this.page = page
    }
       async navigate() {
        await this.page.goto('https://www.demoblaze.com/index.html');
       }

       NavDisplay(){
        return this.page.getByRole('img', { name: 'First slide' })
       }

       leftNav(){
        return this.page.locator('#carouselExampleIndicators').getByRole('button', { name: 'Previous' })
       }

    Right(){
        return this.pagelocator('#carouselExampleIndicators').getByRole('button', { name: 'Next' })
    }

    Categories(){
        return this.page.getByRole('link', { name: 'CATEGORIES' })
    }

    phone(){
        return this.page.getByRole('link', { name: 'Phones' })
    }
    laptops(){
        return this.page.getByRole('link', { name: 'Laptops' })
    }

    mobile(){
        return this.page.getByRole('link', { name: 'Monitors' })
    }

    product(){
        return this.page.getByRole('link', { name: 'Monitors' })
    }


    login(){
        return this.page.getByRole('link', { name: 'Log in' })
    }
    signup(){
        return this.page.getByRole('link', { name: 'Sign up' })
    }

    cart(){
        return this.page.getByRole('link', { name: 'Cart' })
        }
    
    // about(){
    //     return this.page.locator('div').filter({ hasText: 'About Us We believe' }).nth(3)
    getintouch(){
        return this.page.getByText('Get in Touch Address: 2390 El')
    }

    footer(){
        return this.page.getByText('Copyright © Product Store')
    }
    
}