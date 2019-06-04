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

#### het jaartal
bij het klikken op het jaartal zullen er 2 dingen worden ge-update

1. de stacked bar chart:
in de stacked barchart zullen er van het geselecteerde jaar de visvangsten van verschillende vissoorten te zien zijn, elke 'stack' bevat data over de totale visstand van de soort opgedeeld in hoeveelheid vangst, visserijsterfte en het percentage van de visvangst wat als grote vis beschouwd word.

  1. op de stacked barchart kan een vissoort geselecteerd worden, bij het selecteren zal er een stacked line chart worden geplot van elk jaartal met de visstand en visvangst per jaar.

2. de sunburst chart:
in de sunburst chart zullen alle aantallen waarnemingen van verschillende diersoorten te zien zijn (bijv, vissen en bodemfauna). Van elk van deze soorten zullen de aantallen subsoorten worden laten zien.

  1. op de sunburst chart kan een diersoort geselecteerd worden, bij het selecteren zal er een line chart worden geplot van elk jaartal met de met het aantal waarnemingen van elk jaartal.


#### het type visserij
Als er een type visserij geselecteerd word dan zal er van dit type visserij een korteuitleg volgen over wat deze techniek precies inhoud.


## Lijst van D3 componenten:
volgt nog.
