import { animate, animateChild, query, style, transition, trigger } from "@angular/animations";

export const  dropdownAnim = trigger('dropdownAnim', [
    transition(':enter, :leave', [
      query('@*', animateChild())
    ])
  ])
  
export const slideAnim =  trigger('slideDownUp', [
    transition(':enter', [
        style({
            height: '0px',
            opacity: 0
        }),
        animate("300ms ease-out", style({
            height: '*',
            opacity: 1
        }))
    ]),
    transition(':leave', [
        style({
            height: '*',
            opacity: 1
        }),
        animate("300ms ease-out", style({
            height: '0px',
            opacity: 0
        }))
    ])
  ])