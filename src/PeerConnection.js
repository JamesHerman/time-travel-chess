class PeerConnection {
    constructor (props) {
        this.offerChannel = props.offerChannel
        this.connection = new RTCPeerConnection(props.configuration);
        
    }

    openDataChannel() {
        this.dataChannel = this.connection.createDataChannel(); 
        this.connection.createOffer().then(function(offer) {
            return myPeerConnection.setLocalDescription(offer);
        }).then(function() {
            offerChannel.send(myPeerConnection.localDescription)
        }).catch(function(reason) {
            console.log(reason)
        })
    }

    recieveDataChannel() {
        offer = this.offerChannel.recieve(offer)
        RTCPeerConnection.setRemoteDescription(offer) 
    }

    
}