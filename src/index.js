import React from 'react';
import {
	View,
	StatusBar,
	TouchableOpacity,
} from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import propTypes from 'prop-types';

//VARIABLES
const ZOOM = { MIN: 0, MAX: 1.0 }

//COMPONENTS

//STYLESHEET
import styleSheet from './styles';

//-------ANDROID
// Add permission <uses-permission android:name="android.permission.CAMERA" />
//--------------

export default class CameraScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 0,
			flashMode: 'off',
			orientation: Camera.Constants.Type.back
		}
	}

	takePicture = async () => {
		if (this.refs.camera) {
			const options = { quality: 0.5, base64: true };
			let result = await this.refs.camera.takePictureAsync(options);
			if (typeof this.props.onCapture === 'function') {
				this.props.onCaptureFinish(result);
			}
		}
	}

	onPressFlashMode = () => {
		let modeList = [];
		for (const key in Camera.Constants.FlashMode) {
			modeList.push(key);
		}

		for (let i = 0; i < modeList.length; i++) {
			if (modeList[i] == this.state.flashMode) {
				let nextMode;
				if (i + 1 < modeList.length) {
					nextMode = modeList[i + 1];
				} else {
					nextMode = modeList[0];
				}
				this.setState({ flashMode: nextMode });
				break;
			}
		}
	}

	onPressOrientation = () => {
		let { front, back } = Camera.Constants.Type;
		let newOrientation = this.state.orientation == front ? back : front;
		this.setState({ orientation: newOrientation })
	}

	onPressZoom = command => {
		let currentZoom = parseFloat((this.state.zoom).toPrecision(1));
		switch (command) {
			case 'PLUS': {
				if (currentZoom < ZOOM.MAX) {
					this.setState({ zoom: currentZoom + 0.1 });
				}
				break;
			}
			case 'MINUS': {
				if (currentZoom > ZOOM.MIN) {
					this.setState({ zoom: currentZoom - 0.1 });
				}
				break;
			}
			default: break;
		}
		// (0.9999999999999999).toPrecision(2)
	}

	renderFlashIcon = () => {
		let iconName;
		if (this.state.flashMode != 'on' && this.state.flashMode != 'torch') {
			iconName = `flash-${this.state.flashMode}`;
		} else {
			if (this.state.flashMode == 'on') {
				iconName = 'flash';
			} else if (this.state.flashMode == 'torch') {
				iconName = 'flashlight';
			}
		}
		return iconName;
	}

	onCameraReady = () => {
		this.setState({ ready: true });
		if (typeof this.props.onCameraReady === 'function') {
			this.props.onCameraReady();
		}
	}

	onMountError = e => {
		console.log(e);
		if (typeof this.props.onMountError === 'function') {
			this.props.onMountError(e);
		}
	}

	componentWillMount = () => {
		StatusBar.setHidden(true);
	}

	render = () => {
		return (
			<View style={[styleSheet.common.container, { position: 'relative' }]}>
				<Camera
					ref='camera'
					zoom={this.state.zoom}
					style={{ flex: 1 }}
					type={this.state.orientation}
					flashMode={this.state.flashMode}
					permissionDialogTitle={'Permission to use camera'}
					permissionDialogMessage={'We need your permission to use your camera phone'}
					onCameraReady={this.onCameraReady}
					onMountError={this.onMountError}
				/>
				<View style={{ position: 'absolute', width: '100%', height: '100%' }}>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', padding: 10 }}>
							<View style={{ flex: 1 }}></View>
							<View style={{ flex: 1, alignItems: 'center' }}>
								<TouchableOpacity onPress={this.onPressOrientation}>
									<Icon name={'camera-party-mode'} size={25} color={'white'} />
								</TouchableOpacity>
							</View>
							<View style={{ flex: 1, alignItems: 'flex-end' }}>
								<TouchableOpacity onPress={this.onPressFlashMode}>
									<Icon name={this.renderFlashIcon()} size={25} color={'white'} />
								</TouchableOpacity>
								<TouchableOpacity onPress={this.onPressZoom.bind(this, 'PLUS')}>
									<Icon size={25} name={'plus-box-outline'} color={'white'} />
								</TouchableOpacity>
								<TouchableOpacity onPress={this.onPressZoom.bind(this, 'MINUS')}>
									<Icon size={25} name={'minus-box-outline'} color={'white'} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<View>
						<TouchableOpacity onPress={this.takePicture} style={{ alignSelf: 'center', backgroundColor: 'white', borderRadius: 35, marginVertical: 10 }} >
							<View style={{ padding: 10 }}>
								<Icon name={'camera'} size={35} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

CameraScreen.propTypes = {
	onCameraReady: propTypes.func,
	onMountError: propTypes.func,
	onCaptureFinish: propTypes.func.isRequired
}