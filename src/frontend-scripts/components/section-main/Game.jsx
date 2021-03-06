import React from 'react';
import Tracks from './Tracks.jsx';
import Gamechat from './Gamechat.jsx';
import Players from './Players.jsx';
import Confetti from './Confetti.jsx';
import Balloons from './Balloons.jsx';
import PropTypes from 'prop-types';
import playSound from '../reusable/playSound';

export default class Game extends React.Component {
	componentDidUpdate(prevProps) {
		const { userInfo, gameInfo } = this.props;

		if (
			(userInfo.isSeated && gameInfo.gameState && gameInfo.gameState.isTracksFlipped && !prevProps.gameInfo.gameState.isTracksFlipped) ||
			(gameInfo.general.isTourny &&
				gameInfo.general.status === 'Tournament starts in 5 seconds.' &&
				prevProps.gameInfo.general.status !== 'Tournament starts in 5 seconds.')
		) {
			playSound('alarm', 'mp3', 2400);
		}

		if ((userInfo.gameSettings && !userInfo.gameSettings.disableSounds) || !userInfo.gameSettings) {
			if (gameInfo.general.status === 'Dealing roles..' && prevProps.gameInfo.general.status !== 'Dealing roles..') {
				playSound('shuffle', 'wav', 3000);
			}

			if (gameInfo.gameState.audioCue === 'enactPolicy' && prevProps.gameInfo.gameState.audioCue !== 'enactPolicy') {
				playSound('enactpolicy', 'wav', 4000);
			}

			if (gameInfo.general.status === 'Waiting on presidential discard.' && prevProps.gameInfo.general.status !== 'Waiting on presidential discard.') {
				playSound('presidentreceivespolicies', 'wav', 3000);
			}

			if (gameInfo.general.status === 'Waiting on chancellor enactment.' && prevProps.gameInfo.general.status !== 'Waiting on chancellor enactment.') {
				playSound('chancellorreceivespolicies', 'wav', 2000);
			}

			if (gameInfo.gameState.audioCue === 'policyPeek' && prevProps.gameInfo.gameState.audioCue !== 'policyPeek') {
				playSound('policypeek', 'wav', 3000);
			}

			if (gameInfo.gameState.audioCue === 'selectedExecution' && prevProps.gameInfo.gameState.audioCue !== 'selectedExecution') {
				playSound('playershot', 'wav', 11000);
			}

			if (gameInfo.gameState.audioCue === 'selectedInvestigate' && prevProps.gameInfo.gameState.audioCue !== 'selectedInvestigate') {
				playSound('policyinvestigate', 'wav', 11000);
			}

			if (prevProps.gameInfo.general.status === 'President to select special election.' && gameInfo.general.status !== 'Waiting on chancellor enactment.') {
				playSound('policyspecialelection', 'wav', 9000);
			}

			if (gameInfo.gameState.audioCue === 'hitlerShot' && prevProps.gameInfo.gameState.audioCue !== 'hitlerShot') {
				playSound('liberalswinhitlershot', 'aiff', 26000);
			}

			if (gameInfo.gameState.audioCue === 'liberalsWin' && prevProps.gameInfo.gameState.audioCue !== 'liberalsWin') {
				playSound('liberalswin', 'mp3', 19000);
			}

			if (gameInfo.gameState.audioCue === 'fascistsWin' && prevProps.gameInfo.gameState.audioCue !== 'fascistsWin') {
				playSound('fascistswin', 'mp3', 19000);
			}

			if (gameInfo.gameState.audioCue === 'fascistsWinHitlerElected' && prevProps.gameInfo.gameState.audioCue !== 'fascistsWinHitlerElected') {
				playSound('fascistswinhitlerelected', 'wav', 11000);
			}

			if (gameInfo.gameState.audioCue === 'passedVeto' && prevProps.gameInfo.gameState.audioCue !== 'passedVeto') {
				playSound('vetosucceeds', 'wav', 10000);
			}
		}

		// All players have left the game, so we will return the observer to the main screen.
		if (
			(!gameInfo.publicPlayersState.length && !(gameInfo.general.isTourny && gameInfo.general.tournyInfo.round === 0)) ||
			(gameInfo.general.isTourny && gameInfo.general.tournyInfo.round === 0 && !gameInfo.general.tournyInfo.queuedPlayers.length)
		) {
			window.location.hash = '#/';
		}
	}

	render() {
		const { userInfo, gameInfo } = this.props;

		return (
			<section className="game">
				<div className="ui grid">
					<div className="row">
						<div className="ten wide column tracks-container">
							<Tracks userInfo={userInfo} gameInfo={gameInfo} socket={this.props.socket} />
						</div>
						<div className="six wide column chat-container game-chat">
							<section className={gameInfo.general && gameInfo.general.isTourny ? 'gamestatus tourny' : 'gamestatus'}>
								{gameInfo.general && gameInfo.general.status}
							</section>
							<Gamechat userList={this.props.userList} gameInfo={gameInfo} userInfo={userInfo} socket={this.props.socket} />
						</div>
					</div>
				</div>
				{(() => {
					const balloons = Math.random() < 0.1;

					if (
						userInfo.userName &&
						userInfo.gameSettings &&
						!userInfo.gameSettings.disableConfetti &&
						gameInfo &&
						gameInfo.publicPlayersState &&
						gameInfo.publicPlayersState.find(player => player.userName === userInfo.userName) &&
						gameInfo.publicPlayersState.find(player => player.userName === userInfo.userName).isConfetti
					) {
						return balloons ? <Balloons /> : <Confetti />;
					}
				})()}
				<div
					className={(() => {
						let classes = 'row players-container';

						if (userInfo.gameSettings && userInfo.gameSettings.disableRightSidebarInGame) {
							classes += ' disabledrightsidebar';
						}

						return classes;
					})()}
				>
					<Players
						onClickedTakeSeat={this.props.onClickedTakeSeat}
						userList={this.props.userList}
						userInfo={userInfo}
						gameInfo={gameInfo}
						socket={this.props.socket}
					/>
				</div>
			</section>
		);
	}
}

Game.propTypes = {
	onSeatingUser: PropTypes.func,
	userInfo: PropTypes.object,
	gameInfo: PropTypes.object,
	socket: PropTypes.object,
	gameRoleInfo: PropTypes.object,
	clickedPlayerInfo: PropTypes.object,
	clickedGamerole: PropTypes.object,
	clickedPlayer: PropTypes.object,
	expandoInfo: PropTypes.string,
	dispatch: PropTypes.func,
	userList: PropTypes.object
};
