import drugDetailsInitialVal from './../assets/BolusDrugDetails.static.html'
import administerInitialVal from './../assets/BolusDrugAdminister.static.html'
import drugCalculationsInitialVal from './../assets/BolusDrugCalculations.static.html'
import { AdministerDetail, BolusDrug } from './BolusDb'
import { v4 as uuidv4 } from 'uuid'

export class NewBolusDrug implements BolusDrug {
  uuid: string;
  rows: AdministerDetail[];
  constructor (public drugName: string, public department: string, public indication = '') {
    this.uuid = uuidv4()
    this.rows = [
      {
        logicalSelector: '',
        drugDetails: replaceDrugName(this.drugName),
        administer: administerInitialVal,
        calculations: drugCalculationsInitialVal
      }
    ]
  }
}

function replaceDrugName (drugName: string) {
  const output = document.createElement('template')
  output.innerHTML = drugDetailsInitialVal
  const dn = output.content.querySelector('.drug-name')!
  dn.textContent = drugName
  return output.innerHTML
}
