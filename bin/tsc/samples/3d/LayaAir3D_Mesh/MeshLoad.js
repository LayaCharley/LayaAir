import { Laya } from "Laya";
import { Camera } from "laya/d3/core/Camera";
import { DirectionLight } from "laya/d3/core/light/DirectionLight";
import { MeshSprite3D } from "laya/d3/core/MeshSprite3D";
import { PixelLineSprite3D } from "laya/d3/core/pixelLine/PixelLineSprite3D";
import { Scene3D } from "laya/d3/core/scene/Scene3D";
import { Sprite3D } from "laya/d3/core/Sprite3D";
import { Color } from "laya/d3/math/Color";
import { Quaternion } from "laya/d3/math/Quaternion";
import { Vector3 } from "laya/d3/math/Vector3";
import { Mesh } from "laya/d3/resource/models/Mesh";
import { PrimitiveMesh } from "laya/d3/resource/models/PrimitiveMesh";
import { Stage } from "laya/display/Stage";
import { Event } from "laya/events/Event";
import { Button } from "laya/ui/Button";
import { Browser } from "laya/utils/Browser";
import { Handler } from "laya/utils/Handler";
import { Stat } from "laya/utils/Stat";
import { Laya3D } from "Laya3D";
import { Tool } from "../common/Tool";
/**
 * ...
 * @author
 */
export class MeshLoad {
    constructor() {
        this.rotation = new Vector3(0, 0.01, 0);
        this.curStateIndex = 0;
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Stage.SCALE_FULL;
        Laya.stage.screenMode = Stage.SCREEN_NONE;
        //显示性能面板
        Stat.show();
        //创建场景
        var scene = Laya.stage.addChild(new Scene3D());
        //创建相机
        var camera = scene.addChild(new Camera(0, 0.1, 100));
        camera.transform.translate(new Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
        //添加平行光
        var directionLight = scene.addChild(new DirectionLight());
        directionLight.color = new Vector3(0.6, 0.6, 0.6);
        //创建精灵
        this.sprite3D = scene.addChild(new Sprite3D());
        this.lineSprite3D = scene.addChild(new Sprite3D());
        //加载mesh
        Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(this, function (mesh) {
            var layaMonkey = this.sprite3D.addChild(new MeshSprite3D(mesh));
            layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
            //创建像素线渲染精灵
            var layaMonkeyLineSprite3D = this.lineSprite3D.addChild(new PixelLineSprite3D(5000));
            //设置像素线渲染精灵线模式
            Tool.linearModel(layaMonkey, layaMonkeyLineSprite3D, Color.GREEN);
            var plane = this.sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(6, 6, 10, 10)));
            plane.transform.position = new Vector3(0, 0, -1);
            var planeLineSprite3D = this.lineSprite3D.addChild(new PixelLineSprite3D(1000));
            Tool.linearModel(plane, planeLineSprite3D, Color.GRAY);
            //设置时钟定时执行
            Laya.timer.frameLoop(1, this, function () {
                layaMonkeyLineSprite3D.transform.rotate(this.rotation, false);
                layaMonkey.transform.rotate(this.rotation, false);
            });
            this.lineSprite3D.active = false;
            this.loadUI();
        }));
    }
    loadUI() {
        Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function () {
            var changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "正常模式"));
            changeActionButton.size(160, 40);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
            changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
            changeActionButton.on(Event.CLICK, this, function () {
                if (++this.curStateIndex % 2 == 1) {
                    this.sprite3D.active = false;
                    this.lineSprite3D.active = true;
                    changeActionButton.label = "网格模式";
                }
                else {
                    this.sprite3D.active = true;
                    this.lineSprite3D.active = false;
                    changeActionButton.label = "正常模式";
                }
            });
        }));
    }
}
