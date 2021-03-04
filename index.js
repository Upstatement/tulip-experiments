import Paper from "paper";

const ArtGenerator = {
  appNames: [
    "Audit Event Form",
    "Centralized Time Tracking",
    "Digital Andon Monitoring",
    "Digital Andon System",
    "Digital Logbook",
    "Digital Logbook with Work Instructions",
    "Digital History Record",
    "Google Sheets Unit Test",
    "Kanban System",
    "Work Order Tracking App"
  ],
  get appNameSelectEL() {
    return document.getElementById("appNameSelect");
  },
  get customPhraseInputEl() {
    return document.getElementById("customPhraseInput");
  },
  populateAppNameSelectOptions() {
    this.appNames.forEach((name, i) => {
      const optionEl = document.createElement("option");
      optionEl.value = name;
      optionEl.selected = i === 0;
      optionEl.textContent = name;
      this.appNameSelectEL.appendChild(optionEl);
    })
  },

  domSetup() {
    this.populateAppNameSelectOptions();
    this.appNameSelectEL.addEventListener("change", (e) => this.updateArt(e.target.value))
    this.customPhraseInputEl.addEventListener("change", (e) => this.updateArt(e.target.value))
  },

  r: 150,
  colors: [
    "#FED074",
    "#F25E4E",
    "#2B5DBA",
    "#94E6AE",
    "#7661AD",
  ],
  drawAsLine(word) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const getDegreeOf = letter => {
      const isLetter = alphabet.indexOf(letter) >= 0;
      const i = isLetter ? 1 + alphabet.indexOf(letter) : alphabet.length * Math.random();
      return 360 / 26 * i;
    };

    // const getColorFromWord = word => {
    //   const i = word.length % this.colors.length;
    //   return this.colors[i];
    // };

    const path = new Paper.Path();
    // path.strokeColor = getColorFromWord(word);
    path.strokeColor = "black";
    
    [...word].forEach(letter => {
      const theta = getDegreeOf(letter);
      const x = this.r * Math.sin(theta) + Paper.view.center.x;
      const y = this.r * Math.cos(theta) + Paper.view.center.y;
      path.add(new Paper.Point(x, y));
    });

    return path;
  },
  onResize: null,
  generateArt(phraseToDraw) {
    const sanitizedPhrase = phraseToDraw.toLowerCase().split(" ");
    const wordPaths = sanitizedPhrase.map(word => this.drawAsLine(word));

    const outerCircle = new Paper.Path.Circle(Paper.view.center, this.r);
    outerCircle.strokeColor = "black";
    outerCircle.strokeWidth = 2;

    const innerCircleStrokeWidth = 0;
    const innerCircle = new Paper.Path.Circle(Paper.view.center, this.r - innerCircleStrokeWidth + 1);
    innerCircle.strokeColor = "white";
    innerCircle.strokeWidth = innerCircleStrokeWidth;

    const group = new Paper.Group([...wordPaths, outerCircle, innerCircle]);

    Paper.view.draw();

    this.onResize = () => group.position = Paper.view.center;
    window.addEventListener("resize", this.onResize);
  },
  updateArt(phraseToDraw) {
    window.removeEventListener("resize", this.onResize);
    Paper.project.clear();
    this.generateArt(phraseToDraw);
  },

  init() {
    this.domSetup();

    const canvas = document.getElementById('canvas');
    Paper.setup(canvas);

    this.generateArt(this.appNameSelectEL.value);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ArtGenerator.init();
});
