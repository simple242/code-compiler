import {animate, style, transition, trigger} from '@angular/animations'

export const alertAnimation = trigger('alert', [
  transition(':enter', [
    style({opacity: 0, 'max-height': 0}),
    animate('500ms', style({opacity: 1, 'max-height': '100px'}))
  ]),
  transition(':leave', [
    style({opacity: 1, 'max-height': '100px'}),
    animate('500ms', style({opacity: 0, 'max-height': 0}))
  ])
])
