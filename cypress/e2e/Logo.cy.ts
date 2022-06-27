/// <reference types = 'cypress-xpath' />

beforeEach(() => {
    cy.visit('https://todomvc-app-for-testing.surge.sh/')
})

afterEach(()=>{
    cy.reload()
})

describe('logo check', function () {


    it('TC1 logo verification', () => {

        cy.get('.header h1').should('be.visible')
        cy.get('.header h1').should('have.text', 'todos')

    })


    it('TC3 Verify if item can be added successfully', () => {

        //one item added:
        cy.get('.new-todo').type(randomName + '{enter}')
        cy.get('.view label').should('include.text', randomName).should('exist').should('be.visible')
        cy.contains('Active').click()
        cy.get('.view label').should('include.text', randomName).should('exist').should('be.visible')
        cy.contains('Completed').click()
        cy.get('.view label').should('not.exist')
        cy.get('.todo-count strong').should('have.text', 1)

        // 10 more items added
        cy.contains('All').click()

        for (var n = 0; n < 10; n++) {

            cy.get('.new-todo').type(nameOfItems() + '{enter}')

        }

        cy.get('.todo-list li').should('have.length', n + 1)
        cy.contains('Active').click()
        cy.get('.todo-list li').should('have.length', n + 1)
        cy.contains('Completed').click()
        cy.get('.view label').should('not.exist')
        cy.get('.todo-count strong').should('have.text', n + 1)

    })


    it('TC5 No limitation for number of characters', function(){

        cy.get('.new-todo').type(longName + '{enter}',{timeout: 50000})
        
        cy.get('.view label').should(($div)=>{
            const text = $div.text()
         expect(text).to.equal(longName)
        })
    
    })
    
    it('TC6 Special characters and numbers', function(){

        cy.get('.new-todo').type(specCharNum)
        cy.get('.new-todo').type('{enter}')
        cy.get('.view label').should('have.text', specCharNum)
    })


    it('TC7 Delete completed items from the list', function(){

        for (var n = 1; n < 11; n++) {

            cy.get('.new-todo').type('name' + n + '{enter}')

        }
        
        cy.get('.todo-list li').each(($el, index, $list)=>{
            const ime = $el.find('.view label').text()
            const m = getNumber(ime);
            if(m < 6) {
                cy.wrap($el).find('.view input').click({multiple:true})
            }
        })

    })

    it('TC8 Only completed items in list', function(){
        for(var i = 0; i < 5; i++){
        cy.get('.new-todo').type(nameOfItems() + '{enter}')
        }
        cy.get('.view input').click({multiple: true})
        
        //verify that items exist and are visible in "All" tab
        cy.get('.view').should('exist').and('be.visible')
        
        //verify that 'Active' tab does not contain any items
        cy.contains('Active').click()
        cy.get('.view').should('not.exist')
    
        //verify that items exist and are visible in "Completed" tab
        cy.contains('Completed').click()
        cy.get('.view').should('exist').and('be.visible')

        //verify message information for number of items
        cy.get('.todo-count').should('have.text','No items left')

    })
    


    it('TC9 Limit of items in list', function(){

        for(var i = 1; i <= 101; i++){
            cy.get('.new-todo').type('i' + i + '{enter}')
        }
        //verify number of items in list
        cy.get('.view label').its('length').should('eq',101)
    })

    it('TC11 Verification of borders around selected tab', ()=> {
        cy.get('.new-todo').type('itemName{enter}')
        //border existance verification
        cy.get('.filters li a').eq(0).should('have.css', 'border', '1px solid rgba(175, 47, 47, 0.2)')
        cy.get('.filters li a').eq(1).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')
        cy.get('.filters li a').eq(2).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')

        cy.contains('Active').click()
        cy.get('.filters li a').eq(0).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')
        cy.get('.filters li a').eq(1).should('have.css', 'border', '1px solid rgba(175, 47, 47, 0.2)')
        cy.get('.filters li a').eq(2).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')

        cy.contains('Completed').click()
        cy.get('.filters li a').eq(0).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')
        cy.get('.filters li a').eq(1).should('have.css', 'border', '1px solid rgba(0, 0, 0, 0)')
        cy.get('.filters li a').eq(2).should('have.css', 'border', '1px solid rgba(175, 47, 47, 0.2)')
    })

    it('TC12 Clear completed button',function(){

        for (var n = 1; n < 6; n++) {

            cy.get('.new-todo').type('name' + n)
            cy.get('.new-todo').type('{enter}')
        }
        cy.get('button.clear-completed').should('not.exist')
        cy.get('.view input').first().click()
        cy.get('button.clear-completed').should('exist').and('be.visible')
        cy.get('button.clear-completed').click()
        cy.get('button.clear-completed').should('not.exist')
        cy.get('.view input').click({multiple:true})
        cy.get('button.clear-completed').should('exist').and('be.visible')
        cy.get('button.clear-completed').click()
        cy.get('button.clear-completed').should('not.exist')
    })

    it('TC13 Delete items by clicking on X button', function(){
        for(var i = 0; i < 5; i++){
            cy.get('.new-todo').type('randName' + i + '{enter}')
        }
        cy.get('.view button.destroy').invoke('show').click({multiple:true})
        cy.get('.view').should('not.exist')

    })

    
})

function getNumber(str: string) {
    const strippedStr = str.replace(/\D/g,'');
    return Number.parseInt(strippedStr);
}

function nameOfItems() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


function unlimitedNoCharacters() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 500; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const randomName = nameOfItems();
const longName = unlimitedNoCharacters();
const specCharNum = '!@#$%^&*()__+}{|":?> <~|.,/][=-0987654321`"'