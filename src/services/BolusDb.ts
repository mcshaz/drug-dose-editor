import Dexie from 'dexie'

export interface AdministerDetail {
  logicalSelector: string;
  drugDetails: string;
  administer: string;
  calculations: string;
}
export interface BolusDrug {
  uuid: string;
  drugName: string;
  indication: string;
  department: string;
  rows: AdministerDetail[];
}
export interface Department {
  name: string;
  bolusDrugs: string[];
}
/*
Dexie.getDatabaseNames().then(names => {
  console.log('database names: ', names)
  names.forEach(function (name) {
    const db = new Dexie(name)
    db.delete().then(function () {
      console.log('Database successfully deleted: ', name)
    }).catch(function (err) {
      console.error('Could not delete database: ', name, err)
    })
  })
})

BolusDrugDb.instance.bolusDrugs.toArray().then(a => a.forEach(bd => {
  bd.rows.forEach(r => {
    r.drugDetails = r.drugDetails.replaceAll('<small', '<span').replaceAll('</small', '</span')
    r.administer = r.administer.replaceAll('<span class="dilution-method', '<span class="dilution')
    r.calculations = r.calculations.replaceAll('<span class="dose-calculation', '<span class="dose-calc')
      .replaceAll('<span class="calculated-dose', '<span class="final-dose')
  })
  BolusDrugDb.instance.bolusDrugs.put(bd)
}))
*/
export class BolusDrugDb extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  bolusDrugs!: Dexie.Table<BolusDrug, string>; // number = type of the primkey
  departments!: Dexie.Table<Department, string>
  // ...other tables goes here...

  constructor () {
    super('BolusDrugDb')
    this.version(1).stores({
      bolusDrugs: 'uuid,[drugName+department+indication]',
      departments: 'name'
      // ...other tables goes here...
    })
    // https://dexie.org/docs/Dexie/Dexie.on.populate for ajax method
    this.on('populate', db => {
      db.table('departments').bulkAdd([
        {
          name: 'Starship PICU',
          bolusDrugs: []
        },
        {
          name: 'Starship CED',
          bolusDrugs: []
        }
      ])
    })
  }

  public static instance = new BolusDrugDb()
}
