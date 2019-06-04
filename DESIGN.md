# Design document

## Data sources
De data haal ik van de website https://www.clo.nl/, deze website beheerd data over het milieu in Nederland. De data word aangeleverd in verschillende Excel bestanden, deze zet ik om naar CSV bestanden, hierna zullen ze in 3 verschillende JSON-bestanden worden gefusseerd, één voor de visvangst en het bestand van deze gevangen vissen, de visserij-technieken en een voor de trend van diersoorten in de noordzee.

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
* visbestand per soorten

Deze 3 JSON-bestanden zullen worden samengevoegd en gemaakt door middel van de pandas library in python.

## Opzet
![Diagram](/images/diagram.png)

* a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

* as well as descriptions of each of the components and what you need to implement these

* a list of APIs or D3 plugins that you will be using to provide functionality in your app
