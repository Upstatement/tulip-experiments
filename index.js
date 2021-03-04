import Paper from "paper";

const ArtGenerator = {
  appNames: [
    "Audit Event Form",
    "Centralized Time Tracking",
    "Digital Andon Monitoring",
    "Digital Andon System",
    "Digital Logbook",
    "Digital Logbook with Work Instructions"
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

  drawAsLine(word) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const getDegreeOf = letter => 360 / 26 * (1 + alphabet.indexOf(letter));

    const path = new Paper.Path();

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
    const circle = new Paper.Path.Circle(Paper.view.center, this.r);

    const sanitizedPhrase = phraseToDraw.toLowerCase().split(" ");
    const wordPaths = sanitizedPhrase.map(word => this.drawAsLine(word));

    const group = new Paper.Group([circle, ...wordPaths]);
    group.strokeColor = "black";

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
