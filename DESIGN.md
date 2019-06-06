# Design document

### Data Lijst
De data haal ik van de website https://www.clo.nl/, deze website beheerd data over het milieu in Nederland. De data word aangeleverd in verschillende Excel bestanden.

## Data handling
De groep CSV-bestanden zal worden omgezet naar JSON-files door middel van de pandas library in python. hierna zullen alle files in javascript worden samengevoegd tot een drietal JSON-files. één voor de visvangst en het bestand van deze gevangen vissen, een voor de visserij-technieken en een voor de trend van diersoorten in de noordzee.De Json files zullen uit de volgende bestanden bestaan:

### visserij Technieken
 * [gebruikte vistechnieken](Data/visTechnieken.csv)

### visstand/visvangst
* [visbestand totaal](Data/visBestand.csv)
* [vangst data](Data/visVangst.csv)
* [vangst bestand grote vis](Data/groteVis.csv)

### Trend in diersoorten noordzee
* [Bruinvissen trend](Data/Bruinvissen.csv)
* [Eikapsels trend](Data/Eikapsels.csv)
* [haaien en roggen trend](Data/haaiRog.csv)
* [vissoorten trend](Data/vissenTrend.csv)
* [vogels trend](Data/vogels.csv)
* [zoogdieren trend](Data/zoogdieren.csv)
* [bodemfauna trend](Data/bodemFauna.csv)

## Opzet
![Diagram](/images/diagram2.png)

1. Als eerst zal alle data worden verwerkt en worden omgevormd naar een 3-tal JSON-files, dit zal gebeuren met behulp van python en de pandas library

1. Vervolgens zal er een stacked bar chart te zien zijn, deze chart bevat invormatie over de inzet van visserij-technieken over door de jaren heen. Er kan op 2 dingen worden geklikt.

### het jaartal
bij het klikken op het jaartal zullen er 2 dingen worden ge-update

##### de stacked bar chart:
in de stacked barchart zullen er van het geselecteerde jaar de visvangsten van verschillende vissoorten te zien zijn, elke 'stack' bevat data over de totale visstand van de soort opgedeeld in hoeveelheid vangst, visserijsterfte en het percentage van de visvangst wat als grote vis beschouwd word.

  1. op de stacked barchart kan een vissoort geselecteerd worden, bij het selecteren zal er een stacked line chart worden geplot van elk jaartal met de visstand en visvangst per jaar.

##### de sunburst chart:
in de sunburst chart zullen alle aantallen waarnemingen van verschillende diersoorten te zien zijn (bijv, vissen en bodemfauna). Van elk van deze soorten zullen de aantallen subsoorten worden laten zien.

  1. op de sunburst chart kan een diersoort geselecteerd worden, bij het selecteren zal er een line chart worden geplot van elk jaartal met de met het aantal waarnemingen van elk jaartal.


### het type visserij
Als er een type visserij geselecteerd word dan zal er van dit type visserij een korteuitleg volgen over wat deze techniek precies inhoud.


## Lijst van D3 componenten:
volgt nog.
