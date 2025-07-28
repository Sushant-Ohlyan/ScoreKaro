import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Test3 = () => {
    const navigate = useNavigate();
    const [currentWicket, setCurrentWicket] = useState(0);
    const [overs, setOvers] = useState(0);
    const [teamAName, setTeamAName] = useState("Team A");
    const [teamBName, setTeamBName] = useState("Team B"); 
    const [venueName, setVenueName] = useState("Stadium Name");
    const [currentBattingTeam, setCurrentBattingTeam] = useState("Team A");
    const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
    const [currentWicketCount, setCurrentWicketCount] = useState(0);
    const [oversCount, setOversCount] = useState(0);
    const [ballsCount, setBallsCount] = useState(0);
    const [ballHistory, setBallHistory] = useState([]);
    const [batsmen, setBatsmen] = useState(["batsman1", "batsman2"]);
    const [bowler, setBowler] = useState("bowler1");
    const [runTaken, setRunTaken] = useState(0);
    const [wicketTaken, setWicketTaken] = useState(0);
    const [currentBatsman, setCurrentBatsman] = useState(batsmen[0]);
    const [currentBowler, setCurrentBowler] = useState(bowler);

      const legalBallPlayed = () => {
    setBalls(prev => {
      const newBalls = prev + 1;
      if ((newBalls % 6) === 0) {
        setOvers(prev => prev + 1);
        setBowlerStats(stats => ({
          ...stats,
          overs: stats.overs + 1
        }));
      }
      return newBalls;
    });
  };

  const updateBatsmanRun = (runs) => {
    setBatsmen(prev => {
      const updated = prev.map(b =>
        b.name === currentBatsman ? { ...b, runs: b.runs + runs } : b
      );
      return updated;
    });
  };
  const swapStrike = () => {
    setBatsmen(([on, off]) => {
      setCurrentBatsman(off.name);
      return [off, on];
    });
  };
    
    const handleRun = (runs) => {
        let logMessage='';
        const ballNumber='${oversCount}.${ballsCount % 6}';
        if (runs===1 || runs===3){
            if (runs === 1) {
                logMessage = `${ballNumber} - ${runs} RUN - Single taken by ${currentBatsman}`;
            }
            else {
                logMessage = `${ballNumber} - ${runs} RUNS - Three runs taken by ${currentBatsman}`;
            }
            const temp= currentBatsman;
            setCurrentBatsman(batsmen[1]);
            setBatsmen(temp);
        }
        else if (runs === 2) {
            logMessage = `${ballNumber} - ${runs} RUNS - Two runs taken by ${currentBatsman}`;
        } else if (runs === 4) {
            logMessage = `${ballNumber} - ${runs} RUNS - Beautiful drive through covers by ${currentBatsman}`;
        } else if (runs === 6) {
            logMessage = `${ballNumber} - ${runs} RUNS - Massive six over long on by ${currentBatsman}`;
        }

        setCurrentBattingTeamScore(prev => prev + runs);
        setBallHistory([...ballHistory, {type: 'run', value:runs , log:logMessage}]);
        legalBallPlayed();
    }

    const handleWicket = () => {
    const log = `${currentBall} - WICKET - Bowled by ${bowler}, ${currentBatsman} OUT`;

    setWickets(prev => prev + 1);
    setBowlerStats(stats => ({ ...stats, wickets: stats.wickets + 1 }));

    setBallHistory(prev => [...prev, { type: 'wicket', log }]);
    legalBallPlayed();

    setCurrentBatsman(batsmen[1].name); // Temporary handling
  };

    const handleUndo = () => {
    if (ballHistory.length === 0) return;

    const last = ballHistory[ballHistory.length - 1];
    const updated = [...ballHistory];
    updated.pop();
    setBallHistory(updated);

    if (last.type === 'run') {
      setScore(s => s - last.value);
      setBowlerStats(stats => ({ ...stats, runs: stats.runs - last.value }));
      setBalls(b => Math.max(b - 1, 0));
      if ((balls - 1) % 6 === 5) setOvers(o => Math.max(o - 1, 0));

      // Undo strike if needed
      if (last.value % 2 !== 0) swapStrike();

      // Undo batsman runs
      setBatsmen(prev =>
        prev.map(b =>
          b.name === currentBatsman ? { ...b, runs: b.runs - last.value } : b
        )
      );
    } else if (last.type === 'wicket') {
      setWickets(w => Math.max(w - 1, 0));
      setBowlerStats(stats => ({ ...stats, wickets: stats.wickets - 1 }));
      setBalls(b => Math.max(b - 1, 0));
      if ((balls - 1) % 6 === 5) setOvers(o => Math.max(o - 1, 0));
    }
  };

    const handleNoBall = () => {
        const ballNumber = `${oversCount}.${ballsCount % 6}`;
        const logMessage = `${ballNumber} - NO BALL - Bowler overstepped`;

        setBallHistory([...ballHistory, {type: 'no-ball', log: logMessage}]);
        
    }

    const handleWide = () => {
        const ballNumber = `${oversCount}.${ballsCount % 6}`;
        const logMessage = `${ballNumber} - WIDE - Bowler bowled a wide`;

        setBallHistory([...ballHistory, {type: 'wide', log: logMessage}]);
        
    }
    const handleBye = () => {
        const ballNumber = `${oversCount}.${ballsCount % 6}`;
        const logMessage = `${ballNumber} - BYE - Batsman ran for a bye`;

        setBallHistory([...ballHistory, {type: 'bye', log: logMessage}]);
        
    }
    const handleLegBye = () => {
        const ballNumber = `${oversCount}.${ballsCount % 6}`;
        const logMessage = `${ballNumber} - LEG BYE - Batsman ran for a leg bye`;

        setBallHistory([...ballHistory, {type: 'leg-bye', log: logMessage}]);
        
    }


    useEffect(() => {
        if (currentWicket === 10 || overs === 20) {
            navigate('/inning-summary');
        } 
    }, [currentWicket, overs, navigate]); 


  return (
    <div>
        <div>{teamAName} vs {teamBName} </div>
        <div>{venueName}</div>
        <br />
        <div>{currentBattingTeam} : {currentBattingTeamScore}-{currentWicketCount} Overs:- {oversCount}.{ballsCount%6}</div>
        <div>{batsmen[0]} - score  <br /> {batsmen[1]} - score </div>
        <div>{bowler} - {oversCount}.{ballsCount%6} ({runTaken}) {wicketTaken}</div>
        <div>
            <button onClick={() => handleRun(1)}>1</button>
            <button onClick={() => handleRun(2)}>2</button>
            <button onClick={() => handleRun(3)}>3</button>
            <button onClick={() => handleRun(4)}>4</button>
            <button onClick={() => handleRun(6)}>6</button>
            <button onClick={() => handleWicket}>Wicket</button>
            <button onClick={() => handleNoBall()}>No Ball</button>
            <button onClick={() => handleWide()}>Wide</button>
            <button onClick={() => handleBye()}>Bye</button>
            <button onClick={() => handleLegBye()}>Leg Bye</button>
            <button onClick={() => handleUndo}>Undo</button>
        </div>
        <div>
            Ball-By-Ball History:
            <ul>
  {ballHistory.map((entry, index) => (
    <li key={index}>{entry.log}</li>
  ))}
</ul>
        </div>
    </div>
  )
}

export default Test3;