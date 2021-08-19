import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import {Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, FormLabel, TextField} from "@material-ui/core";
import axios from "axios";
import './App.css';

export default function App() {

    // Send request if enter Is GIGA Repeated Right Now
/*    document.addEventListener('keydown', function(event) {
        if (event.repeat){
            return;
        }
        if (event.key === "Enter"){
            sendRequest(teamUsernames);
        }
        });*/

    const [requestAnswer, setRequestAnswer] = React.useState({
        error: "",
        isFirst: true,
        hasGotten: true,
        user1: "",
        user2: "",
        user3: "",
        user4: "",
        user5: "",
        gamesWon: 0,
        totalGames: 0,
    })

    const [noOfGames, setNoOfGames] = React.useState<number>(30);
    const handleNoOfGames = (event: any, newValue: number | number[]) => {
        setNoOfGames(newValue as number);
    };

    const [teamUsernames, setTeamUsernames] = React.useState({
        user1: "",
        user2: "",
        user3: "",
        user4: "",
        user5: ""
    });
    const handleUsernames = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamUsernames({ ...teamUsernames, [event.target.name]: event.target.value });
    };

    /*
    * Game type buttons Buttons:
    * */
    const [gameTypes, setGameTypes] = React.useState({
        aram: true,
        flex: true,
        soloduo: true,
        draft: true,
        blind: true,
        other: true
    });
    const handleChangeGameTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameTypes({ ...gameTypes, [event.target.name]: event.target.checked });
    };

    const sendRequest = (usernames:  {user1: string, user2: string, user3: string, user4: string, user5: string}) => {

        console.log("Trying to send request...")

        if (!requestAnswer.hasGotten){
            console.log("Please wait for current request to finish before sending a new request")
            return;
        }

        setRequestAnswer({
            ...requestAnswer,
            isFirst: false,
            hasGotten: false
        })

        // FIX Username Order
        let usernamesList = [];
        if (usernames.user1 !== ""){
            usernamesList.push(usernames.user1);
        }
        if (usernames.user2 !== ""){
            usernamesList.push(usernames.user2);
        }
        if (usernames.user3 !== ""){
            usernamesList.push(usernames.user3);
        }
        if (usernames.user4 !== ""){
            usernamesList.push(usernames.user4);
        }
        if (usernames.user5 !== ""){
            usernamesList.push(usernames.user5);
        }

        let correctUsernames;
        switch (usernamesList.length) {
            case 1:
                correctUsernames = {
                    user1: usernamesList[0]
                }
                break;
            case 2:
                correctUsernames = {
                    user1: usernamesList[0],
                    user2: usernamesList[1]
                }
                break;
            case 3:
                correctUsernames = {
                    user1: usernamesList[0],
                    user2: usernamesList[1],
                    user3: usernamesList[2]
                }
                break;
            case 4:
                correctUsernames = {
                    user1: usernamesList[0],
                    user2: usernamesList[1],
                    user3: usernamesList[2],
                    user4: usernamesList[3]
                }
                break;
            case 5:
                correctUsernames = {
                    ...usernames
                }
                break;
        }

        const url = `https://winrateapi.lucaswinther.info/api/WinRate/GetWinrateTogether/${usernamesList.length}`

        const convertMatchTypesToBackend = (gameTypes: {aram: boolean, flex: boolean, soloduo: boolean, draft: boolean, blind: boolean, other: boolean}) => {

            let returnString = "";

            if (gameTypes.aram){
                returnString = returnString + "a";
            }
            if (gameTypes.soloduo){
                returnString = returnString + "s";
            }
            if (gameTypes.flex){
                returnString = returnString + "f";
            }
            if (gameTypes.draft){
                returnString = returnString + "d";
            }
            if (gameTypes.blind){
                returnString = returnString + "b";
            }
            if (gameTypes.other){
                returnString = returnString + "o";
            }

            return returnString;
        }

        const userNameThatIsInTheRequest = {...correctUsernames}

        const parameters = {
            ...correctUsernames,
            NoMatches: noOfGames,
            MatchSelector: `${convertMatchTypesToBackend(gameTypes)}`
        }

        axios.get(url, {
            params: parameters
        }).then(function (result) {
            console.log(result.data);

            setRequestAnswer({
                ...requestAnswer,
                ...userNameThatIsInTheRequest,
                gamesWon: result.data.wins,
                totalGames: result.data.wins + result.data.losses,
                hasGotten: true,
                isFirst: false,
                error: ""
            })

        }).catch(function (error) {
            console.log("There was an error getting the winrate");
            console.log(error);

            setRequestAnswer({
                ...requestAnswer,
                error: "Sorry, there was an error. Please check your usernames, or wait again and try later.",
                isFirst: false,
                hasGotten: true
            })

        }).then(function () {
            // TODO: Maybe move assignment of HasGotten into here.
        });
    }


    return (
        <div id={"appContainer"}>

            <FormLabel component="legend">Users</FormLabel>
            <FormGroup>
                 <TextField id="standard-basic" label="user1" value={teamUsernames.user1} onChange={handleUsernames} name={"user1"}/>
                 <TextField id="standard-basic" label="user2" value={teamUsernames.user2} onChange={handleUsernames} name={"user2"}/>
                <TextField id="standard-basic" label="user3" value={teamUsernames.user3} onChange={handleUsernames} name={"user3"} />
                <TextField id="standard-basic" label="user4" value={teamUsernames.user4} onChange={handleUsernames} name={"user4"} />
                <TextField id="standard-basic" label="user5" value={teamUsernames.user5} onChange={handleUsernames} name={"user5"} />
            </FormGroup>



            <Typography gutterBottom>
                Number of games: {noOfGames}
            </Typography>
            <Grid container spacing={2} id={"sliderContainer"}>
                <Grid item xs>
                    <Slider value={noOfGames} onChange={handleNoOfGames} aria-labelledby="continuous-slider" />
                </Grid>
            </Grid>

            <FormLabel component="legend">Assign Game Types</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.aram} onChange={handleChangeGameTypes} name="aram" />}
                    label="Aram"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.flex} onChange={handleChangeGameTypes} name="flex" />}
                    label="Ranked Flex"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.soloduo} onChange={handleChangeGameTypes} name="soloduo" />}
                    label="Ranked Solo/Duo"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.draft} onChange={handleChangeGameTypes} name="draft" />}
                    label="Normal Draft"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.blind} onChange={handleChangeGameTypes} name="blind" />}
                    label="Normal Blind"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.other} onChange={handleChangeGameTypes} name="other" />}
                    label="Other Gamemodes (Poro King, One For All, Etc)"
                />
            </FormGroup>

            <Button variant="contained" color="primary" onClick={() => sendRequest(teamUsernames)}>
                Send
            </Button>

            {requestAnswer.isFirst ? "" :
                !requestAnswer.hasGotten ?
                    <CircularProgress /> :
                    requestAnswer.error !== "" ? <p>{requestAnswer.error}</p> :
                            <Typography>
                                The winrate of {requestAnswer.user1}{requestAnswer.user2 !== "" ? `, ${requestAnswer.user2}` : ""}{requestAnswer.user3 !== "" ? `, ${requestAnswer.user3}` : ""}{requestAnswer.user4 !== "" ? `, ${requestAnswer.user4}` : ""}{requestAnswer.user5 !== "" ? `, ${requestAnswer.user5}` : ""} is {((requestAnswer.gamesWon/requestAnswer.totalGames) * 100).toFixed(2)}% based on their recent {requestAnswer.totalGames} {requestAnswer.totalGames > 1 ? "games" : "game"} together.
                            </Typography>
            }



        </div>

    );
}