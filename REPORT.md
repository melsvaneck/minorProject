# REPORT

## De visualisaties

![eindpagina](/images/eindversie.png)

In de visualisaties zijn 3 charts te zien, een stacked area chart, een circle packing chart en een line chart.

### De stacked Area chart (Links Boven)
Deze chart laat de inzet van visserijtechnieken zien van 1991 tot 2016 in miljoen pk-dagen. Door op de boxes op de legenda te klikken kan je area's weghalen en toevoegen, klik je op een jaar dan wordt de circle packing chart geüpdatet.

### De circle packing chart (Rechts)
Deze chart laat de trend van diersoorten zien van het geselecteerde jaar, hoe groter de cirkel, hoe meer waarnemingen. Als je op een diersoort klikt zoomt hij in op de geselecteerde soort om de namen van deze dieren te zien. klik op een diersoort en de line chart zal de trend in waarnemingen laten zien van deze soort. Ook kan de circle packing chart worden geüpdatet door middel van de slider helemaal rechts in het scherm.

### De line chart (Linksonder)
De line chart laat de trend in waarnemingen van een geselecteerde diersoort zien. Je kan met je muis over de chart heen om de waardes van het verloop te zien.

## code Design
De code bestaat uit een aantal verschillende scripts:

### convert.py
Dit script is gebruikt om alle csv bestanden om te zetten naar JSON bestanden zodat de dat goed bruikbaar is in javascript en D3.

### Main.js
Hierin wordt alle data opgehaald door middel van een promise, met deze data kunnen de functies aangeroepen worden die de visualisaties maken.

### stackedLine.js
Hierin zitten 2 functies, een voor het maken van de stacked area chart (makeStackLine) en eentje voor het toevoegen of verwijderen van een area (updateStackLine).

#### makeStackLine
Hier zullen als eerst de hoogte en breedte opgehaald worden van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald.De data die van main.js afkomt zal worden omgezet naar bruikbare data door middel van de functie d3.stack. hiermee kunnen de areas worden gemaakt voor de chart. Vervolgens zal er aan de hand van de data die van main.js afkomt een x en y scaling worden gemaakt, x-scaling voor het totaal aantal pk-dagen en de y-scaling voor het aantal jaren, voor de y-scaling is er nog voor gekozen om het maximale getal (hoogste getal op de y-as) omhoog af te ronden zodat het hoogste punt van de area ook nog duidelijk af te lezen is. Met deze scaling kunnen nu allebei de assen worden aangemaakt en aangeroepen worden, hetzelfde zal gebeuren met de gridlines.Vervolgens zullen er van de data per visserijtechniek verschillende "areas" worden gemaakt met de d3.area() functie, deze areas zullen als paths worden toegevoegt aan de chart en vervolgens worden gevuld met kleur aan de hand van de color scaling. ook is er een legenda aangemaakt van checkboxes van de technieken een highlight functie als er over deze legenda wordt gehoverd.


#### updateStackLine
Bij het aanmaken van de legenda is er een "onclick" functie meegegeven aan elke checkbox, als deze wordt aangeklikt zet hij de waarde van de checkbox op true of false (aan de hand van zijn eerdere staat). vervolgens zal deze boolean ook meegegeven worden aan de update functie. Bij een true is de checkbox aangeklikt en zullen alle waardes van de geselecteerde techniek worden omgezet naar nul. Bij een false zullen alle waardes teruggezet worden naar zijn originele waardes.Hierna word de chart geüpdatet en zullen de areas worden weggehaald of weer worden teruggezet.

### circlePacking.js
dir programma bestaat uit 3 functies, een voor het maken van de circle packing chart (makeCirclepacking), een voor het updaten van de circle packing chart (updateCircle) en een eentje voor het preparen van de data voor een circle packing chart(pickYear).

#### pickYear
Deze functie zal aan de hand van een geselecteerd jaar alle data ophalen van dat jaar en het omzetten naar een bruikbare hiërarchische data (flare.JSON).

#### makeCirclepacking
de data die van main.js afkomt zal worden omgezet naar bruikbare data door middel van de functie pickYear(). Er zal als standaard jaar het jaar 2016 geselecteerd worden. Vervolgens wordt de diameter opgehaald van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald. Hierna zal er met de functie d3.hierarchy() en d3.pack() de juiste datastructuur worden aangemaakt om de cirkels mee te definiëren. Met deze aangepaste datastructuur kunnen de circles en de tekst die bij de cirkels hoort worden aangemaakt. Na het aanmaken van de cirkels kan er met de zoom functie de maten en locaties van de cirkels worden gedefinieerd en zo word de circle packing chart gevisualiseerd.

Op de cirkels van de diersoorten zit een "onclick" functie die de linechart update.

#### updateCircle
Deze functie zal worden aangeroepen door de slider te verplaatsen of door op een jaar te klikken op de stacked area chart. bij het aanroepen zal er met het nieuw geselecteerde jaar een nieuwe chart met nieuwe waardes worden aangemaakt. en zullen alle circles en teksten hun waardes worden veranderd en opnieuw worden gevisualiseerd.

### lineChart.js
De lineChart bestaat uit drie functies, één om de data in het juiste format te zetten(makeLineData), een functie om line chart aan te maken (makenormLine), en eentje om de chart up te daten (updateLine).

#### makeLineData
in de functie makeLineData zal er aan de hand van de geselecteerde diersoort data worden opgehaald over de trend van deze diersoort over de jaren waarin er data beschikbaar is van deze diersoort en vervolgens data in het juiste format terugsturen.

#### makenormLine
Hier zullen als eerst de hoogte en breedte opgehaald worden van een <div> element die is aangemaakt in de html van de pagina, hiermee zal de grote van het <svg> element worden bepaald. Vervolgens zal er met de functie makeLineData() de juiste data worden opgehaald voor het maken van de lijn. er is voor gekozen om als eerst de data van de noordse stormvogel te laten zien. Na het verkrijgen van de juiste data zullen aan de hand hiervan de x en y scaling worden gemaakt, de x scaling zal alle jaren van waarnemingen bevatten en de y scaling zal van 0 tot de hoogste waarde van waarnemingen bevatten. Vervolgens zullen deze worden aangeroepen. Hetzelfde zal met de gridlijnen gebeuren. Vervolgens zal er een lijn worden gegenereerd aan de hand van de data door middel van de functie d3.line().Deze gemaakte lijn word vervolgens ook toegevoegd aan de chart. Na het toevoegen van de lijn zal er voor elk jaar op de lijn een puntje worden toegevoegd om het aflezen makkelijker te maken.

ook is er een functie toegevoegd die de positie van de muis volgt en aan de hand van de muispositie de waarde op de lijn op dat punt laat zien.

#### updateLine
deze functie zal aan de hand van een geselecteerde diersoort de data aanpassen en de assen en lijn updaten.

## Proces en keuzes
Hierin zullen een aantal veranderingen worden toegelicht van het eindproduct ten opzichte van het voorstel

![GitHub Logo](/images/voorstel2.png)
het voorstel van week 1

![eindpagina](/images/eindversie.png)
het eindproduct

### 4e visualisatie
Het voorstel (bovenste afbeelding) bestaat uit een viertal visualisaties, een stacked area chart, een line chart, een circle packing chart en een stacked bar chart, het eindproduct (onderste afbeelding) bestaat uit "slechts" 3 visualisaties zoals eerder genoemd. Hieronder staat een uitleg wat hier de reden van is geworden.

De 4e visualisatie zou een stacked barchart worden van vissoorten waarop gevist word (afbeelding onder de tekst), hiermee hoopte ik een beeld te krijgen over de invloed op niet alleen de fauna maar ook op de vis waarop gevist word. Tijdens het maken van het voorstel was nog niet geheel duidelijk hoe de volledige dataset van deze chart eruit zag, hierdoor kwam ik er tijdens het maken van de stacked bar chart achter dat er verschillen in aantallen van diersoorten zodanig groot waren dat er in de visualisatie niet meer duidelijk te zien was wat er met de andere diersoorten gebeurde. Toen heb ik er voor gekozen om er een sunburst chart van te maken omdat ik hiermee mijn doel van het duidelijk visualiseren eventueel wel zou behalen, echter kwam ik er al snel achter dat het verstandiger was om er eerst voor te zorgen dat alle andere visualisaties goed op orde zijn. Dit kostte meer tijd dan verwacht dus heb ik er voor gekozen om het bij 3 visualisaties te houden om hiermee de kwaliteit te kunnen waarborgen.

![oldbarchart](/images/oldbar.PNG)

### Line chart veranderingen
In het voorstel staat dat de line chart zodanig kan worden geüpdatet dat er meerdere lijnen van diersoorten werden laten zien. Hier is uiteindelijk van afgeweken omdat er bij sommige diersoorten gewoonweg te grootte verschillen zijn in waarneming (van 10000 tot 20) waardoor het vergelijken van deze diersoorten niet goed zou verlopen. Het had eventueel gekund door het updaten van de y-as onder bepaalde voorwaarden maar hiervoor was niet genoeg tijd.
