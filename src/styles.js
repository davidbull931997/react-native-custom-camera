import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const common = StyleSheet.create({
    container: {
        flex: 1
    }
});

const styles = {
    common
};

export default styles;