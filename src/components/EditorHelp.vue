<template>
  <div class="text-left">
    <section>
      <h3>Calculations</h3>
      <p>
        All calculations must be inside the <code>code</code> segments.
        You can select these by using the menu buttton
        (down the bottom right of the editor)
        which looks like
        <span class="badge bg-light text-dark">
          {;}
        </span>.
        You can also see you are in a <code>code</code> segment by checking that
        the bottom left of the editor window states
        <span class="badge bg-light text-dark">
          div &gt; span &gt; code
        </span>
      </p>
    </section>
    <section>
      <h3>Formats</h3>
      <p>
        Within the menu at the bottom right of each editor 'cell' you should
        select the relevant predefined format by name - e.g.
        <span class="drug-name">Drug name</span>. Only the predefined formats relevant
        to each column of the table are available in each cell. For example you cannot select
        the 'Drug name' format in the second column, but you can select the
        <span class="dilution-method">
          Dilution method
        </span> format in the second column.
      </p>
      <p>
        Advantages of sticking to the predefined format include consistency and also
        the format can be changed for all drugs if required in the future.
      </p>
    </section>
    <section>
      <h3>Variable names/patient measurements</h3>
      <p>
        Within the chart you can right click to see the variable names - usually weightKg,
        but you also have access to age, corrected gestational age (CGA) and
        body surface are (BSA).
        Obviously these are only available if the user has entered the relevant data
        - e.g. height for BSA.
      </p>
    </section>
    <section>
      <h3>Rounding functions</h3>
      <p>
        There are also helper rounding functions available - wrap the calculation
        in one of the following:
      </p>
      <dl>
        <dt>round.toDecimalPlaces (value, decimalPlaces)</dt>
        <dd>
          e.g. <code>round.toDecimalPlaces(weightKg*0.4, 3)</code> - rounded to the given number
          of decimal places, for instance 1234 will remain 1234 but 0.1234 becomes 0.123
        </dd>
        <dt>
          round.toNearest (value, nearest)
        </dt>
        <dd>
          e.g. <code>round.toNearest(weightKg*0.04, 0.025)</code> - will round to the
          nearest multiple, for instance 1234 to nearest 5 is 1235 and 0.1234 to
          nearest 0.005 is 0.125
        </dd>
        <dt>
          round.toPrecision (value, precision)
        </dt>
        <dd>
          e.g. <code>round.toPrecision(weightKg*0.4, 2)</code> - will round to the
          given precision - for instance 1234 to precision 2 is 1200
          and 0.1234 to precision 2 is 0.12
        </dd>
        <dt>round.toSyringeVolume (value)</dt>
        <dd>
          e.g. <code>round.toSyringeVolume(weightKg*0.4)</code> - the final volume will determine the rounding, based on what can
          realistically
          be approximated in the relevant syringe size. For example a 1 ml syring rounds
          to the nearest 0.01 of a ml, and volumes over 10ml to the nearest ml.
        </dd>
      </dl>
    </section>
    <section>
      <h3>
        Logical selector
      </h3>
      <p>
        The Logical Selector allows you to select which row of drug data will be
        shown, based on age or weight.
      </p>
      <p>
        The logical selectors will be evaluated in the order they appear, with the first
        selector evaluating to <code>true</code> coresponding to the row being displayed.
        One logical seelctor may be empty, and this is the default if
        no other selectors return true.
      </p>
      <p>
        The clone button will duplicate a given row including any calculations,
        formatting and the logical selector, so that each of these components
        can be edited as appropriate to create a row of data relevant for a
        different age/weight.
      </p>
    </section>
  </div>
</template>
