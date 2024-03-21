import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import ABI from "./ABI.json";
import Login from "./components/Login.jsx";
import Connected from "./components/Connected.jsx";
const ContractAddress = "0x9B2a3DC9A350981aE41e53A97219ab14Aa64c75B";

  function App() {
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingtime, setremainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [CanVote, setCanVote] = useState(true);
  const [statuss, setStatus] = useState("");

    useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  async function votee() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        ContractAddress,
        ABI,
        signer
      );
      const tx = await contractInstance.vote(number);
      await tx.wait();
      canVote();
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        setStatus("User denide vote transection");
      } else {
        console.error("Error in voting:", error.message);
        setStatus("Error in voting");
      }
    }
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(ContractAddress, ABI, signer);
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }
  // user rejected transaction
  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(ContractAddress, ABI, signer);
    const candidatesList = await contractInstance.getAllvotesOfCandidates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      };
    });
    setCandidates(formattedCandidates);
    // console.log(candidatesList);
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(ContractAddress, ABI, signer);
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(ContractAddress, ABI, signer);
    const time = await contractInstance.getReaminingTime();
    console.log(time);
    setremainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("metamask is connected to " + address);
        setIsConnected(true);
        canVote();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("metamask not connected to browser");
    }
  }

  return (
    <div className="App">
      {isConnected ? (
        <Connected
          account={account}
          candidates={candidates}
          remainingtime={remainingtime}
          number={number}
          handleNumberChange={handleNumberChange}
          voteFunction={votee}
          showButton={CanVote}
          statuss={statuss}
        />
      ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  );
}

export default App;
