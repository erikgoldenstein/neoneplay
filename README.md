<p align="center">
  <img width="250" height="250" src="https://i.imgur.com/DovNhG7.png">
</p>


<h1 align="center">
  ✨ NE:ONE Play ✨
</h1>

This is a [Hackathon](https://onerecord-fra.devpost.com) implementation of the [NE:ONE Play](https://devpost.com/software/ne-one-play) One Record Editor. Due to the nature of this code being written in 28 hours it is not pretty and pretty buggy. Therefore, this code is to be used <b>at your own Risk</b>, this code is <b>not being maintained</b>. A maintained and production ready version is currently in the planning.

<p align="center">
<a href="http://www.youtube.com/watch?feature=player_embedded&v=WwSXzxIoqN8" target="_blank">
 <img src="http://img.youtube.com/vi/WwSXzxIoqN8/mqdefault.jpg" alt="Watch the video" width="320" height="180" border="10" />
</a>
  <p align="center">&#8593; Submission Video from Hackathon with Demo &#8593;</p>
</p>

### 🏁 Getting Started
```bash
git clone https://github.com/aloccid-iata/neoneplay.git
cd neoneplay
npm i
npm run dev
```
Now connect to `localhost:3000` and enter your One Record Object ID in the Search bar at the top.

The code was developed and tested (very limited testing 😅) using the Chrome Browser, therefore for the best experience use Chrome.

### 🚧 Known Issues
- One Record Server has to have enabled [CORS Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- When using One Record Servers without token authentication you need to expand the card to load the data (fixing this should just be adding a dependency to the useEffect Effect Array)
- Some Features only work after a HotReload, this can be done by just changing a random file (could be adding a semicolon) in the project and saving it (for example the arrow descriptors are only located correctly after a hot reload)
- Patch (Change) Requests only work on text fields outside of embedded objects. After committing a patch request the change is only displayed on servers without tokens, while on a server with a token the change is made but not shown in the UI. (sometimes patches don't work, in the hackathon there was not enough time for debugging)

### 🔎 Quirks
In the Hackathon the One Record Servers had a Bearer Token for Security Reasons. To demonstrate the NE:ONE Play Editor we asked for multiple servers to show how it could work with multiple industry players. We were given multiple servers, with the quirk that they all used the same Bearer Token, therefore in the Code (Settings.js file) there is a `globalToken` which is the Token for all of the hackathon servers. In the Hackathon this token was always filled in by hand as it had a lifetime of one hour.

### ✨ Development by
- Figma Design Prototypes: [Man Bao Tran Nguyen](https://www.linkedin.com/in/trannguyen97/)
- Test Data Creation: [Niclas Scheiber](https://www.linkedin.com/in/niclas-scheiber-1283b8105/)
- Software Implementation: [Erik Goldenstein](https://www.linkedin.com/in/erik-goldenstein-a338a1224/)

--------
If there are any questions, you are welcome to open an Issue, answers are not guaranteed. If you are interested in further exploring NE:ONE, NE:ONE Play or any other ONE Record related topics together, please feel free to contact Oliver Ditz (oliver.ditz@iml.fraunhofer.de) from the department of aviation logistics of the Fraunhofer IML.
