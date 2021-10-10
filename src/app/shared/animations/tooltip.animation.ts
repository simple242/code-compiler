import {animate, style, transition, trigger} from '@angular/animations'

export const tooltipAnimation = trigger('tooltip', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms', style({opacity: 1}))
  ]),
  transition(':leave', [
    style({opacity: 1}),
    animate('500ms', style({opacity: 0}))
  ])
])
