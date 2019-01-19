var ballProps = {
    "collisionsWillMove": true,
    "color": {
        "blue": 0,
        "green": 0,
        "red": 255
    },
    "created": "2018-10-29T12:17:34Z",
    "dimensions": {
        "blue": 0.3499999940395355,
        "green": 0.3499999940395355,
        "red": 0.3499999940395355,
        "x": 0.3499999940395355,
        "y": 0.3499999940395355,
        "z": 0.3499999940395355
    },
    "dynamic": true,
    "gravity": {
        "blue": 0,
        "green": -9.800000190734863,
        "red": 0,
        "x": 0,
        "y": -9.800000190734863,
        "z": 0
    },
    "id": "{be4b084c-859c-4571-ad35-3d3a6dbc1dca}",
    "lastEdited": 1540816406033489,
    "lastEditedBy": "{32aed6cd-d501-4289-9f89-2dbc7c1a6009}",
    "name": "Party-Ball!",
    "queryAACube": {
        "scale": 0.6062177419662476,
        "x": -0.3031088709831238,
        "y": -0.3031088709831238,
        "z": -0.3031088709831238
    },
    "rotation": {
        "w": 0.037644028663635254,
        "x": 0.8319370746612549,
        "y": 0.08461129665374756,
        "z": -0.547051191329956
    },
    "script": "https://hifi-content.s3.amazonaws.com/milad/ROLC/d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-content/marketplaceItems/partyBall/entityResources/entityClientScripts/partyBall_client.js?" + Date.now(),
    "serverScripts": "https://hifi-content.s3.amazonaws.com/milad/ROLC/d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-content/marketplaceItems/partyBall/entityResources/entityServerScripts/partyBall_server.js?" + Date.now(),
    "type": "Sphere",
    "userData": "{\"grabbableKey\":{\"grabbable\":true}}"
}

var ballMaterialProps = {
    "created": "2018-10-29T12:19:45Z",
    "id": "{f408f577-6b66-4acd-a1a2-c2d4190d59bf}",
    "lastEdited": 1540816404771470,
    "lastEditedBy": "{32aed6cd-d501-4289-9f89-2dbc7c1a6009}",
    "materialData": "{\n  \"materialVersion\": 1,\n  \"materials\": {\n    \"albedoMap\": \"https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/O_Projects/Hifi/Scripts/hifi-content/Prototyping/Suprise_Ball/question.png\",\n    \"emissiveMap\": \"https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/O_Projects/Hifi/Scripts/hifi-content/Prototyping/Suprise_Ball/question.png\"\n  }\n}",
    "materialMappingScale": {
        "x": 7,
        "y": 7
    },
    "materialURL": "materialData",
    "name": "Party-Ball-Material",
    "parentID": "{be4b084c-859c-4571-ad35-3d3a6dbc1dca}",
    "position": {
        "blue": -3.4815166145563126e-06,
        "green": 0,
        "red": 0,
        "x": 0,
        "y": 0,
        "z": -3.4815166145563126e-06
    },
    "priority": 1,
    "queryAACube": {
        "scale": 0.17320507764816284,
        "x": 95.96235656738281,
        "y": 10.319595336914062,
        "z": 85.14569091796875
    },
    "rotation": {
        "w": 1,
        "x": -1.52587890625e-05,
        "y": -1.52587890625e-05,
        "z": -1.52587890625e-05
    },
    "type": "Material"
};

ballProps.position = Vec3.sum(MyAvatar.position, Vec3.multiply(Quat.getForward(MyAvatar.orientation), 1));
Entities.addEntity(ballProps);
Entities.addEntity(ballMaterialProps);