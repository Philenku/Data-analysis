import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-starter-library',
  template: `
    <p>
      <strong>
      If you can see this, that means that StarterLibraryComponent is working!
      </strong>
    </p>
  `,
  styles: [
  ]
})
export class StarterLibraryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
