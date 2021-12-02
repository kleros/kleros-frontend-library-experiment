import React from "react";
import { Footer } from "../lib/index";
// import { EvidenceTimeline } from "../lib/index";
import Archon from "@kleros/archon";

const archon = new Archon(window.ethereum, "https://ipfs.kleros.io");

const KLEROS = Object.freeze({
  1: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
  42: "0x60B2AbfDfaD9c0873242f59f2A8c32A3Cc682f80"
});

const DISPUTE_ID = 629;
const ARBITRATED = "0x122b6601deC837DBE0c1ffb25A1089770EFE53a2";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evidences: [],
      currentRuling: "",
      network: 42
    };
  }

  getDisputeCreation = () =>
    archon.arbitrable.getDispute(
      ARBITRATED,
      KLEROS[this.state.network],
      DISPUTE_ID
    );

  getCurrentRuling = () =>
    archon.arbitrator.getCurrentRuling(KLEROS[this.state.network], DISPUTE_ID);

  getRuling = () =>
    archon.arbitrable.getRuling(
      ARBITRATED,
      KLEROS[this.state.network],
      DISPUTE_ID
    );

  getAppealDecision = () =>
    archon.arbitrator.getAppealDecision(
      KLEROS[this.state.network],
      DISPUTE_ID,
      1
    );

  getMetaEvidence = async () => {
    const disputeLog = await archon.arbitrable.getDispute(
      ARBITRATED, // arbitrable contract address
      KLEROS[this.state.network], // arbitrator contract address
      DISPUTE_ID // dispute unique identifier
    );

    const metaevidence = await archon.arbitrable.getMetaEvidence(
      ARBITRATED, // arbitrable contract address
      disputeLog.metaEvidenceID
    );

    return metaevidence;
  };

  getEvidence = async () => {
    const disputeLog = await archon.arbitrable.getDispute(
      ARBITRATED, // arbitrable contract address
      KLEROS[this.state.network], // arbitrator contract address
      DISPUTE_ID // dispute unique identifier
    );

    const evidence = await archon.arbitrable.getEvidence(
      ARBITRATED,
      KLEROS[this.state.network],
      disputeLog.evidenceGroupID
    );
    return evidence;
  };

  componentDidMount = async () => {
    const metaevidence = await this.getMetaEvidence();
    const evidences = await this.getEvidence();
    //const ruling = await this.getRuling();
    const currentRuling = await this.getCurrentRuling();
    const disputeEvent = await this.getDisputeCreation();

    this.setState({
      metaevidence,
      evidences,
      //ruling,
      currentRuling,
      disputeEvent
    });
  };

  render() {
    if (!this.state.network) return null;
    console.log(this.state);
    return (
      <>
        <br />
        <Footer
          key={1}
          appName="Test Application"
          repository="https://github.com/kleros/react-components"
        />
      </>
    );
  }
}

export default App;
