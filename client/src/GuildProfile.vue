<template>
    <div id="app">
        <div v-if="!serverBooelan">
            <h1 style="text-align:center;color:white;margin-top:12%;font-size:80px">404</h1>
            <h1 style="text-align:center;color:white;margin-top:2%">Böyle bir sunucu bulunamadı!</h1>
        </div>
        <br>
        <div v-if="serverBooelan">
            <img class="serverİcon" :src="icon">
            <h1 class="guildName" style="color:white">{{ name }} </h1> <br>
            <h2 class="allahYazıyıListelememeYardımEdiyo">Sunucu hakkımdası yakında!</h2>
            <br>

            <div class="categorysKutu">
<br><br>
                <h1 style="color: white; padding: 1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif; text-align: left; font-size: 20.25px;">
                    Bilgi
                </h1>

            <div class="çizgi"></div>
<br>
<h2 style="color:white;padding: 1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif; font-size: 15.75px;">
                  <i class="fas fa-microphone"></i> Ses: {{ Voicecount }} <br><br>
                  <i class="fas fa-user"></i> Üye: {{ memberCount }} <br><br>
                  <i class="fas fa-calendar"></i> Oluşturulma: {{ createdAt }} <br><br>
                </h2>

                <h1 style="color: white; padding: 1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif; text-align: left; font-size: 20.25px;">
                    Ses
                </h1>

            <div class="çizgi"></div>
            <h2 style="color:white;padding: 1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif; font-size: 13.5px;">
             Son 24 saatlik ortalama ses aktifliği: {{ Voicecount }} </h2>

            </div>
          
   
        </div>
    </div>

</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
    data() {
        return {
            serverBooelan: false,
            id: this.$route.params.id,
            name: '',
            icon: '',
            memberCount: 0,
            createdAt: '',
            Textchannels: 0,
            Voicechannels: 0,
            Categorychannels: 0,
            Voicecount: 0,
            ChannelAll: 0,
            boostCount: 0,
            privateURL: '',
            botCount: 0,
            ownerID: '',
            emojiCount: 0,
            VoiceBot: '',
            video: '',
            serverMute: '',
            serverDeaf: '',
            kategoriNames: [],
            invite: '',
            guildID: '',
        }
    },
    created() {
        axios.get('http://localhost:3000/server/' + this.id).then((response) => {

            if (response.data.name === false) {
                this.serverBooelan = false;
            } else if (response.data.name) {
                this.serverBooelan = true
                this.name = response.data.name.slice(0, 30)
                this.guildID = response.data.id
                this.icon = response.data.icon
                this.memberCount = response.data.memberCount
                this.createdAt = moment(response.data.createdAt).format('D/M/YYYY');
                this.Textchannels = response.data.Textchannels
                this.Voicechannels = response.data.Voicechannels
                this.Categorychannels = response.data.Categorychannels
                this.Voicecount = response.data.Voicecount
                this.ChannelAll = response.data.Textchannels + response.data.Voicechannels,
                    this.boostCount = response.data.boostCount
                this.privateURL = response.data.privateURL
                this.botCount = response.data.botCount
                this.ownerID = response.data.ownerID
                this.ownerName = response.data.ownerName
                this.emojiCount = response.data.emojiCount
                this.VoiceBot = response.data.VoiceBot
                this.video = response.data.video
                this.serverMute = response.data.serverMute
                this.serverDeaf = response.data.serverDeaf
                this.kategoriNames = response.data.kategoriName.filter(a => a.count > 0 && a).slice(0, 8)
                this.invite = response.data.invite ? response.data.invite : 'https://localhost:8080/guilds/' + response.data.id;
                this.bannerURL = response.data.bannerURL
            }
        })
    },
    methods: {
        titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }
    }
}
</script>

<style>

.kutu {
    text-align: left;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #111111;
    color: white;
    width: 500px;
    height: 200px;
    font-size: 10px;
    position: absolute;
    top: 302px;
    left: 30px;
    border-radius: 20px;
    background-color: #1B263D;
    opacity: 0.7;
}

.kutu2 {
    text-align: left;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #111111;
    color: white;
    width: 500px;
    height: 200px;
    font-size: 10px;
    position: absolute;
    top: 302px;
    left: 1090px;
    border-radius: 20px;
    background-image: url(https://cdn.discordapp.com/attachments/1079147672742674494/1087033870211350558/image.png);
    opacity: 0.7;
}

.rightTitle {
    position: absolute;
    top: 235px;
    font-size: 20px;
    left: 1130px
}

.çizgi {
    margin: 5px 0px;
    border: 1px solid #292828;
    border-color: #303030;
}

.memberCount {
    position: absolute;
    top: 128px;
    left: 260px;
    color: #8d8c8c;
    font-size: 17px
}

.guildName {
  font-size: 20px;

position: absolute;
    left: 550px;
    top: 270px   
}

.categorys {
    font-size: 20px;

    text-align: center;
    position: absolute;
    top: 236px;
    left: 600px;
    color: white;

}

.categorysKutu {
    font-size: 10px;
    width: 1100px;
    height: 600px;
    position: absolute;
    top: 400px;
    left: 310px;
    background-color: #1d2230;
    border-radius: 20px;
   opacity: 0.7;
}

.button {
    width: 200px;
    background-color: #3B82F6;
    border: 1px solid #3a00a7;
    color: white;
    padding: 6px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    margin: 10px 2px;
    cursor: pointer;
    position: absolute;
    top: 240px;
    left: 740px;
    height: 52px;
    border-radius: 20px;
    font-weight: bold;
    transition: 0.5s;
}
.button:hover{
    background-color: #3a00a7 ;

}

.serverİcon {
    border-radius: 50%;
    position: absolute;
    top: 223px;
    left: 405px;
    width: 126px;
    border-color: antiquewhite;
}

.body {
background-image: url(https://cdn.discordapp.com/attachments/1075400424871436328/1087391803646431262/vebeb.png);
}

.ortalafln {
    text-align: center;
    width: 1700px;
    position: absolute;
    border-radius: 20px;
}

.allahYazıyıListelememeYardımEdiyo {
    font-size: 20px;
    position: absolute;
    left: 550px;
    top: 300px;
    color: #D4D4D8CC;
    font-size: 13.5px; 
}
</style>
