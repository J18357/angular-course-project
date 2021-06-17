import { Directive, HostBinding, HostListener, ElementRef, Input, OnInit, TemplateRef,ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective{
    //add CSS class 'open' if element is clicked and removes it if element is clicked again
    //isOpen = directive, @HostBinding dynamically attaches or detaches class to element
    @HostBinding('class.open') isOpen= false;

    // toggle on click
    /* @HostListener('click') toggleOpen(eventData:Event){
        this.isOpen = !this.isOpen;
    } */

    //close Dropdown by clicking anywhere, by placing listener not on the dropdown, but on the document
    @HostListener('document:click', ['$event']) toggleOpen(event: Event){
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen :false;
    }

    constructor(private elRef: ElementRef){}
}
    
