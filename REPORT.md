# REPORT

## De visualistaies

![eindpagina](/images/eindversie.png)

In de visualisaties zijn 3 charts te zien, een stacked area chart, een circle packing chart en een line chart.

### De stacked Area chart (Linksboven)
Deze chart laat de inzet van visserijtechnieken zien van 1991 tot 2016 in miljoen pk-dagen. Door op de boxes op de legenda te klikken kan je area's weghalen en toevoegen, klik je op een jaar dan wordt de circle packing chart ge-update.

### De circle packing chart (Rechts)
Deze chart laat de trend van diersoorten zien van het geselecteerde jaar, hoe groter de cirkel, hoe meer waarnemingen. Als je op een diersoort klikt zoomt hij in op de geselcteerde soort om de namen van deze dieren te zien. klik op een diersoort en de line chart zal de trend in waarnemingen laten zien van deze soort. Ook kan de circle packing chart worden geupdate door middel van de slider helemaal rechts in het scherm.

### De line chart (Linksonder)
De line chart laat de trend in waarneminge van een geselcteerde diersoort zien. Je kan met je muis over de chart heen om de waardes van het verloop te zien.

## code Design
De code bestaat uit een aantal verchillende scripts:

### convert.py
Dit script is gebruikt om alle csv bestanden om te zetten naar JSON bestanden zodat de dat goed bruikbaar is in javascript en D3.

### Main.js
Hierin wordt alle data opgehaald door middel van een promise, met deze data kunnen de functies aangeroepen worden die de visualisaties maken.

### stackedLine.js
Hierin zitten 2 functies, een voor het maken van de stacked area chart (makeStackLine) en eentje voor het toevoegen of verwijderen van een area (updateStackLine).

#### makeStackLine
Hier zullen als eerst de hoogte en breedte opgehaald worden van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald.

de data die van main.js afkomt zal worden omgezet naar bruikbare data door middel van de functie d3.stack. hiermee kunnen de areas worden gemaakt voor de chart.

vervolgens zal er aan de hand van de data die van main.js afkomt en x en y scaling worden gemaakt, x-scaling voor het totaal aantal pk-dagen en de y-scaling voor het aantal jaren, voor de y-scaling is er nog voor gekozen om het maximale getal omhoof af te ronden zodat het hoogste punt van de area ook nog duidelijk af te lezen is.

Met deze scaling kunnen nu allebij de assen worden aangemaakt en gecalled, hetzelfde zal gebeuren met de gridlines.

Vervolgens zullen er van de data per visserijtechniek verschillende "areas" worden gemaakt met de d3.area() functie,deze areas zullen als paths worden toegevoegt aan de chart en vervolgens worden gevuld met kleur aan de hand van de color scaling. ook is er een legenda aangemaakt van checkboxes van de technieken een hihglight functie als er over deze legenda wordt gehoverd.


#### updateStackLine
Bij het aanmaken van de legenda is er een "onclick" functie meegegeven aan elke checkbox, als deze wordt aangeklikt zet hij de waarde van de checkbox op true of false (aan de hand van zijn eerdere staat). vervolgens zal deze boolean ook meegegeven worden aan de update functie. Bij een true is de checkbox aangeklikt en zullen alle waardes van de geselcteerde techniek worden omgezet naar nul. bij een false zullen alle waardes teruggezet worden naar zijn originele waardes.

Hierna word de chart geupdate en zullen de areas worden weeggehaald of weer worden teruggezet.

### circlePacking.js
dir programma bestaat uit 3 functies, een voor het maken van de circle packing chart (makeCirclepacking), een voor het updaten van de circle packing chart (updateCircle) en een eentje voor het preparen van de data voor een circle packing chart(pickYear).


#### pickYear
Deze functie zal aan de hand van een geselcteerd jaar alle data ophalen van dat jaar en het omzetten naar een bruikbare heirargische data (flare.JSON).

#### makeCirclepacking
de data die van main.js afkomt zal worden omgezet naar bruikbare data door middel van de functie pickYear(). Er zal als standaard jaar het jaar 2016 geselcteerd worden.  

Vervolgens wordt de diameter opgehaald van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald.

vervolgens zal er met de functie d3.hierarchy() en d3.pack() de juiste datastructuur worden aangemaakt om de cirkels mee te defineren.

met deze aangepasta datastructuur kunnen de circles en de text die bij de circles hoort worden aangemaakt.Na het aanmaken van de cirkels kan er met de zoom functie de maten en locaties van de cirkels worden gedefineerd en zo word de circle packing chart gevisualiseerd.

Op de cirkels van de diersoorten zit een "onclick" functie die de linechart update.

#### updateCircle
Deze functie zal worden aangeroepen door de slider te verplaatsen of door op een jaar te klikken op de stacked area chart. bij het aanroepen zal er met het nieuw geselecteerde jaar een nieuwe chart met nieuwe waardes worden aangemaakt.

### lineChart.js
De lineChart bestaat uit twee functies, een om de datain het juiste format te zetten(makeLineData), een functie om line chart aan te maken (makenormLine), en eentje om de chart up te daten (updateLine).

#### makeLineData
in de functie makeLineData zal er aan de hand van de geselecteerde diersoort data worden opgehaald over de trend van deze diersoort over de jaren waarin er data beschikbaar is van deze diersoort en vervolgens data in het juiste format terugsturen.

#### makenormLine
Hier zullen als eerst de hoogte en breedte opgehaald worden van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald.

vervolgens zal er met de functie makeLineData() de juiste data worden opgehaald voor het maken van de lijn. er is voor gekozen om als eerst de data van de noordse stormvogel te laten zien.

na het verkrijgen van de juiste data zullen aan de hand hiervan de x en y scaling worden gemaakt, de x scaling zal alle jaren van waarnemingen bevatten en de y scaling zal van 0 tot de hoogste waarde van waarnemingen bevatten.Vervolgens zullen deze worden aangeroepen.Hetzelfde zal met de gridlijnen gebeuren.

vervolgens zal er een lijn worden gegenereerd aan de hand van de data door middel van de functie d3.line().Deze gemaakte lijn word vervolgens ook toegevoegd aan de chart.Na het toevoegen van de lijn zal er voor elk jaar op de lijn een puntje worden toegevoegd om het aflezen makkelijker te maken.

ook is er een functie toegevoegd die de positie van de muis volgt en aan de hand van de muispositie de waarde op de lijn op dat punt laat zien.

#### updateLine
deze functie zal aan de hand van een geselcteerde diersoord de data aanpassen en de assen en lijn updaten.

## Proces en keuzes

![GitHub Logo](/images/voorstel2.png)
![eindpagina](/images/eindversie.png)

Create a report (REPORT.md), based on your design document, containing important decisions that you’ve made, e.g. where you changed your mind during the past weeks. This is how you show the reviewer that you actually understand what you have done.


Clearly describe challenges that your have met during development. Document all important changes that your have made with regard to your design document (from the PROCESS.md). Here, we can see how much you have learned in the past month.

Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before? Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?

Make sure the document is complete and reflects the final state of the application. The document will be an important part of your grade.
