/// <reference types = 'cypress-xpath' />

beforeEach(() => {
    cy.visit("https://todomvc-app-for-testing.surge.sh/");
  });
  
  //Strahinja - why is reaload happening in the after each step?
  afterEach(() => {
    cy.reload();
  });
  
  describe("logo check", function () {
    it("TC1 logo verification", () => {
      //Jelena: This can be written in one line: cy.get('.header h1').should('be.visible').should('have.text', 'todos');
      cy.get(".header h1").should("be.visible");
      cy.get(".header h1").should("have.text", "todos");
    });
  
    //Strahinja - You should write test name as actual action for example:
    //Strahinja - TC3 - Item is added to (the TO DO) list
    //Jelena: Since every test title starts with TC, here missing TC2, but it is hard to maintain when there are a lot of tests, so it is enough to have just a test title without numbering
    it("TC3 Verify if item can be added successfully", () => {
      //one item added:
      cy.get(".new-todo").type(randomName + "{enter}");
      cy.get(".view label")
        .should("include.text", randomName)
        .should("exist")
        .should("be.visible"); //Jelena: Too much assertion (three times used should) and duplicated code (explanation below the test)
      //Strahinja - here you are missing actual locator
      cy.contains("Active").click();
      cy.get(".view label")
        .should("include.text", randomName)
        .should("exist")
        .should("be.visible"); //Jelena: Too much assertion (three times used should) and duplicated code (explanation below the test)
      //Strahinja - here you are missing actual locator
      cy.contains("Completed").click();
      cy.get(".view label").should("not.exist");
      cy.get(".todo-count strong").should("have.text", 1);
  
      // 10 more items added
      cy.contains("All").click();
  
      for (var n = 0; n < 10; n++) {
        cy.get(".new-todo").type(nameOfItems() + "{enter}");
      }
  
      cy.get(".todo-list li").should("have.length", n + 1);
      cy.contains("Active").click();
      cy.get(".todo-list li").should("have.length", n + 1); //Jelena: Same implementation as two lines above (duplicated code - explanation below the test)
      cy.contains("Completed").click();
      cy.get(".view label").should("not.exist"); //Jelena: Duplicated code (more info below the test)
      cy.get(".todo-count strong").should("have.text", n + 1);
    });
    /* Jelena: Explanation for "Too much assertion" => when asserting one element, it is enough to assert that is visible (or that exists) and if it's necessary to assert that contains some text.
       Explanation for "Duplicated code" => those three lines that are marked as duplicated, that means that when you need to change something in code, you'll need to search every line and change it manually, 
       so the best practice is to put code that will be used more times into const method (somewhere at the top of the file, or create helper folder with exported helper methods) and then call that method whenever you need in tests.*/
    
    //Jelena: Missing TC4
    it("TC5 No limitation for number of characters", function () {
      cy.get(".new-todo").type(longName + "{enter}", { timeout: 50000 });
  
      cy.get(".view label").should(($div) => {
        const text = $div.text();
        expect(text).to.equal(longName);
      });
    });
  
    it("TC6 Special characters and numbers", function () {
      //Jelena: When typing on the same element, commands can be placed in one line, something like this: cy.get('.new-todo').type(specCharNum, 'enter')
      cy.get(".new-todo").type(specCharNum);
      cy.get(".new-todo").type("{enter}");
      cy.get(".view label").should("have.text", specCharNum);
    });
  
    it("TC7 Delete completed items from the list", function () {
      for (var n = 1; n < 11; n++) {
        cy.get(".new-todo").type("name" + n + "{enter}");
      }
  
      cy.get(".todo-list li").each(($el, index, $list) => {
        const ime = $el.find(".view label").text();
        const m = getNumber(ime);
        if (m < 6) {
          cy.wrap($el).find(".view input").click({ multiple: true });
        }
      });
    });
  
    it("TC8 Only completed items in list", function () {
      for (var i = 0; i < 5; i++) {
        cy.get(".new-todo").type(nameOfItems() + "{enter}");
      }
      cy.get(".view input").click({ multiple: true });
  
      //verify that items exist and are visible in "All" tab
      cy.get(".view").should("exist").and("be.visible");
  
      //verify that 'Active' tab does not contain any items
      cy.contains("Active").click();
      cy.get(".view").should("not.exist");
  
      //verify that items exist and are visible in "Completed" tab
      cy.contains("Completed").click();
      cy.get(".view").should("exist").and("be.visible");
  
      //verify message information for number of items
      cy.get(".todo-count").should("have.text", "No items left");
    });
  
    it("TC9 Limit of items in list", function () {
      for (var i = 1; i <= 101; i++) {
        cy.get(".new-todo").type("i" + i + "{enter}");
      }
      //verify number of items in list
      cy.get(".view label").its("length").should("eq", 101);
    });
  
    it("TC11 Verification of borders around selected tab", () => {
      cy.get(".new-todo").type("itemName{enter}");
      //border existance verification
      cy.get(".filters li a")
        .eq(0)
        .should("have.css", "border", "1px solid rgba(175, 47, 47, 0.2)");
      cy.get(".filters li a")
        .eq(1)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
      cy.get(".filters li a")
        .eq(2)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
  
      cy.contains("Active").click();
      cy.get(".filters li a")
        .eq(0)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
      cy.get(".filters li a")
        .eq(1)
        .should("have.css", "border", "1px solid rgba(175, 47, 47, 0.2)");
      cy.get(".filters li a")
        .eq(2)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
  
      cy.contains("Completed").click();
      cy.get(".filters li a")
        .eq(0)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
      cy.get(".filters li a")
        .eq(1)
        .should("have.css", "border", "1px solid rgba(0, 0, 0, 0)");
      cy.get(".filters li a")
        .eq(2)
        .should("have.css", "border", "1px solid rgba(175, 47, 47, 0.2)");
    });
  
    it("TC12 Clear completed button", function () {
      for (var n = 1; n < 6; n++) {
         //Jelena: Code below can be written in one line
        cy.get(".new-todo").type("name" + n);
        cy.get(".new-todo").type("{enter}");
      }
      cy.get("button.clear-completed").should("not.exist");
      cy.get(".view input").first().click();
      cy.get("button.clear-completed").should("exist").and("be.visible");
      cy.get("button.clear-completed").click(); //Jelena: click() can be added in the line above after asserting "be.visible"
      cy.get("button.clear-completed").should("not.exist");
      cy.get(".view input").click({ multiple: true });
      cy.get("button.clear-completed").should("exist").and("be.visible");
      cy.get("button.clear-completed").click();
      cy.get("button.clear-completed").should("not.exist"); //Jelena: The last three lines => Duplicated code.
    });
  
    it("TC13 Delete items by clicking on X button", function () {
      for (var i = 0; i < 5; i++) {
        cy.get(".new-todo").type("randName" + i + "{enter}");
      }
      cy.get(".view button.destroy").invoke("show").click({ multiple: true });
      cy.get(".view").should("not.exist");
    });
  });
  
  //Strahinja - it is best practice to keep function and variables at the top of the file
  //Strahinja - even better would be to move this to a separate file and export it from there
  //          - and import it here in this file - that can be your taks
  
  //Jelena: Functions and const variables can be placed at the top of this file, also the creation of helper files for functions and importing it in this file is recommended
  function getNumber(str: string) {
    const strippedStr = str.replace(/\D/g, "");
    return Number.parseInt(strippedStr);
  }
  
  /* 
  Strahinja - Two functions that you have - "nameOfItems" and "unlimitedNoCharacters" are actually completely same
  and as a best practice you should avoid duplication of code.
  In this case you could easily avoid that by passing single parameter in a function which will 
  determine the length of the string. That will improve it since you will be able to pass any string
  length when calling function, and you wont have duplicate code.
  */
  function nameOfItems() {
    //Strahinja - you should not use var - instead you should be using let or const (it is considered best practice)
    //Strahinja - use let when variable is being changed and const when variable have fixed value (you can look it up online how to use it)
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  
  function unlimitedNoCharacters() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 500; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  
  //Strahinja - these const can stay inside this file, but you can move them to the top of the file
  const randomName = nameOfItems();
  const longName = unlimitedNoCharacters();
  const specCharNum = '!@#$%^&*()__+}{|":?> <~|.,/][=-0987654321`"';
  