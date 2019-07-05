import { Sprite3D } from "../Sprite3D";
import { BaseRender } from "../render/BaseRender";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Render } from "../../../renders/Render";
import { FrustumCulling } from "../../graphics/FrustumCulling";
/**
 * <code>TrailRenderer</code> 类用于创建拖尾渲染器。
 */
export class TrailRenderer extends BaseRender {
    constructor(owner) {
        super(owner);
        this._projectionViewWorldMatrix = new Matrix4x4();
    }
    /**
     * @inheritDoc
     * @override
     */
    _calculateBoundingBox() {
        //TODO:无需转换,直接计算出的包围体就是世界的
        if (Render.supportWebGLPlusCulling) { //[NATIVE]
            var min = this._bounds.getMin();
            var max = this._bounds.getMax();
            var buffer = FrustumCulling._cullingBuffer;
            buffer[this._cullingBufferIndex + 1] = min.x;
            buffer[this._cullingBufferIndex + 2] = min.y;
            buffer[this._cullingBufferIndex + 3] = min.z;
            buffer[this._cullingBufferIndex + 4] = max.x;
            buffer[this._cullingBufferIndex + 5] = max.y;
            buffer[this._cullingBufferIndex + 6] = max.z;
        }
    }
    /**
     * @inheritDoc
     */
    /*override*/ _needRender(boundFrustum) {
        return true;
    }
    /**
     * @inheritDoc
     */
    /*override*/ _renderUpdate(state, transform) {
        super._renderUpdate(state, transform);
        this._owner.trailFilter._update(state);
    }
    /**
     * @inheritDoc
     */
    /*override*/ _renderUpdateWithCamera(context, transform) {
        var projectionView = context.projectionViewMatrix;
        if (transform) {
            Matrix4x4.multiply(projectionView, transform.worldMatrix, this._projectionViewWorldMatrix);
            this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, this._projectionViewWorldMatrix);
        }
        else {
            this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, projectionView);
        }
    }
}
