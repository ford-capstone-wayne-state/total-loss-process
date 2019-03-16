import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss'],
})
export class NewClaimComponent {
  appearance = new FormControl();
  vin = new FormControl('', [Validators.required, Validators.minLength(11)]);
  date_of_loss = new FormControl('');
  miles = new FormControl('');
  location = new FormControl('');
  name = new FormControl('');
  deductible = new FormControl('');
  has_gap = new FormControl('');

  constructor(private middlewareService: MiddlewareService) {
    this.appearance.setValue('outlined');
  }

  private setClaim() {
    const claim = {
      date_of_loss: this.date_of_loss.value,
      vehicle: {
        vin: this.vin.value,
        miles: +this.miles.value,
        location: this.location.value,
      },
      insurer: {
        name: this.name.value,
        deductible: +this.deductible.value,
        has_gap: false,
      },
    };

    // FIXME: Remove this
    console.log(this.middlewareService.addClaim(claim));
  }

  sendNewClaim() {
    this.setClaim();
  }

  hasEmptyFields(): boolean {
    return this.areFieldsUntouched() || this.hasErroredFields();
  }

  areFieldsUntouched(): boolean {
    return !(
      this.date_of_loss.value &&
      this.vin.value &&
      this.miles.value &&
      this.location.value &&
      this.name.value &&
      this.deductible.value &&
      this.has_gap.value
    );
  }

  hasErroredFields(): boolean {
    return this.vin.hasError('minlength') || this.vin.hasError('required');
  }

  public numberValidator(event: any) {
    const charactersAllowed = /^[0-9]*$/;

    if (!charactersAllowed.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  }

  public alphaNumericValidator(event: any) {
    const charactersAllowed = /^[a-zA-Z0-9]*$/;

    // If the value inputted does not match anything
    // in the defined pattern, replace with nothing.
    if (!charactersAllowed.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
    }
  }
}
