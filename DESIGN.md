# Design document

## Data sources
De data haal ik van de website https://www.clo.nl/, deze website beheerd data over het milieu in Nederland. De data word aangeleverd in verschillende Excel bestanden, deze zet ik om naar CSV bestanden, hierna zullen ze in 3 verschillende JSON-bestanden worden gefuseerd, één voor de visvangst en het bestand van deze gevangen vissen, de visserij-technieken en een voor de trend van diersoorten in de noordzee.

### visserij Technieken
 * gebruikte visserij-technieken

### visstand/visvangst
* visbestand
* visvangst bestand
* percentage grote vis van de vangst

### Trend in diersoorten noordzee
* bruinvissen
* Eikapsels haaien en roggen
* waarnemingen haaien en roggen
* vogelbestand per soort
* visbestand per soort
* bodemfaunabestand per soort

Deze 3 JSON-bestanden zullen worden samengevoegd en gemaakt door middel van de pandas library in python.

## Opzet
![Diagram](/images/schema.PNG)

1. Als eerst zal alle data worden verwerkt en worden omgevormd naar een 3-tal JSON-files, dit zal gebeuren met behulp van python en de pandas library

1. Vervolgens zal er een stacked bar chart te zien zijn, deze chart bevat invormatie over de inzet van visserij-technieken over door de jaren heen. Er kan op 2 dingen worden geklikt.

    1. het jaartal
    bij het klikken op het jaartal zullen er 2 dingen worden ge-update

      1. de stacked bar chart
      in de stacked barchart zullen er van het geselecteerde jaar de visvangsten van verschillende vissoorten te zien zijn, elke 'stack' bevat data over de totale visstand van de soort opgedeeld in hoeveelheid vangst, visserijsterfte en

    1. de sunburst chart

  1. het type vrisserij
1. Item 3b
<!-- is de diagram goed? -->
* a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

* as well as descriptions of each of the components and what you need to implement these
<!-- componenten beschrijven goed in diagram? -->

* a list of APIs or D3 plugins that you will be using to provide functionality in your app
<!-- bv een geojson plugin?  -->
