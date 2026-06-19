<!--
* @Description: 代办跑腿类目信息详情
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-09-25 07:25:17
* @LastEditors: wangxc
* @LastEditTime: 2024-09-25 07:25:17
-->
<template>
  <view class="agent-detail-box">
    <view class="body">
      <view class="info-title" v-if="isuInfoView.title">{{ isuInfoView.title }}</view>
      <view class="info-isu" v-if="isuUserInfo">
        <view class="auth-line-a">
          <view class="left">
            <view class="avator">
              <image class="avatar" v-if="isuUserInfo.avatarUrl" :src="isuUserInfo.avatarUrl" mode=""></image>
              <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="auth">
              <view class="auth-name">{{ isuUserInfo.nickName }}</view>
              <view class="auth-time">{{ $util.timeAgo(isuInfoView.isuTime) }}</view>
            </view>
          </view>
          <view class="right">
            <view class="auth-op">
              <interestBtn tagUserId="isuUserInfo.uid"></interestBtn>
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <text :user-select="true">{{ isuInfoView.content }}</text>
      </view>
      <view class="img" v-if="imgUrls && imgUrls.length > 0">
        <u-swiper :list="imgUrls" mode="number" indicator-pos="bottomRight" img-mode="aspectFit" autoplay="false" @click="previewImage"></u-swiper>
      </view>
      <view class="info-fields" v-if="isuInfoView.isIsuer === 1 || isJoin">
        <view class="col" v-if="isuInfoView.contactMan">
          <view class="title">联系人</view>
          <view class="form-input">{{ isuInfoView.contactMan }}</view>
        </view>
        <view class="col" v-if="isuInfoView.phone">
          <view class="title">电话</view>
          <view class="form-input">{{ isuInfoView.phone }}</view>
          <view class="op-btn call-phone" v-if="isJoin" @click="makePhone(isuInfoView.phone)">
            <text class="myicon icon-c002dianhua">拨打电话</text>
          </view>
        </view>
      </view>
      <view class="info-fields" v-else>
        <view class="col">
          <text class="myicon icon-tishi" style="color: #ff9900"></text>
          <text style="color: #71d5a1">接单后可查看发布人联系方式</text>
        </view>
      </view>
      <view class="info-fields">
        <view class="col" v-if="isuInfoView.buildPark || isuInfoView.buildNo || isuInfoView.buildUnit">
          <view class="title">位置</view>
          <view class="form-input">
            <text v-if="isuInfoView.buildPark">{{ isuInfoView.buildPark }}园区</text>
            <text class="field" v-if="isuInfoView.buildNo">{{ isuInfoView.buildNo }}楼</text>
            <text class="field" v-if="isuInfoView.buildUnit">{{ isuInfoView.buildUnit }}单元</text>
            <text class="field" v-if="isuInfoView.buildRoom">{{ isuInfoView.buildRoom }}室</text>
          </view>
        </view>
        <view class="col">
          <view class="title">跑腿赏金</view>
          <view class="form-input flex">
            <template v-if="isuInfoView.isIsuer === 1">
              <view class="flex" style="width: 100rpx">
                <text class="money">{{ dyData.reward || 0.00 }} </text>
                <text>元</text>
              </view>
              <!-- 对于微信支付,赏金调整不是太方便，暂时取消此功能 -->
              <view v-if="false && spfs.runingStatus < 4" class="op-btn add-reward" @click="rewardUpdForm.show = true">
                <text class="myicon icon-zengjia2">增加赏金</text>
              </view>
            </template>
            <template v-else>
              <view class="flex" style="width: 100rpx">
                <text class="money">{{ dyData.bCalcRecReward || 0.00 }} </text>
                <text>元</text>
              </view>
            </template>
          </view>
        </view>

        <template v-if="['take', 'sent'].includes(dyData.bizType)">
          <view class="col">
            <view class="title">取货地点</view>
            <view class="form-input">{{ dyData.takeAddr }}</view>
          </view>
          <view class="col">
            <view class="title">收货地址</view>
            <view class="form-input">{{ dyData.putAddr }}</view>
          </view>
        </template>
        <template v-if="['buy'].includes(dyData.bizType)">
          <view class="col">
            <view class="title">送达地点</view>
            <view class="form-input">{{ dyData.putAddr }}</view>
          </view>
        </template>
        <template v-if="['trash'].includes(dyData.bizType)">
          <view class="col">
            <view class="title">取物地点</view>
            <view class="form-input">{{ dyData.takeAddr }}</view>
          </view>
        </template>
        <view class="col">
          <view class="title">代办备注</view>
          <view class="form-input">{{ dyData.remark || '无' }}</view>
        </view>
        <template v-if="['take', 'sent', 'buy', 'do'].includes(dyData.bizType)">
          <view class="col">
            <view class="title" v-if="dyData.bizType === 'do'">期望完成</view>
            <view class="title" v-else>期望送达</view>
            <view class="form-input">{{ pickAskSpeed.t }}</view>
          </view>
          <view class="col">
            <view class="title">人员限制</view>
            <view class="form-input">{{ pickWorker.t }}</view>
          </view>
        </template>
        <template v-else-if="['trash'].includes(dyData.bizType)">
          <view class="col">
            <view class="title">垃圾大小</view>
            <view class="form-input">{{ pickTrashSize.t }}</view>
          </view>
          <view class="col">
            <view class="title">垃圾数量</view>
            <view class="form-input">{{ dyData.trashNum || 1 }}</view>
          </view>
        </template>

        <template v-else-if="['with'].includes(dyData.bizType)">
          <view class="col">
            <view class="title">搭子人数</view>
            <view class="form-input">{{ dyData.joinerNum || 1 }} 人</view>
          </view>
          <view class="col">
            <view class="title">活动日期</view>
            <view class="form-input">{{ dyData.actDate }}</view>
          </view>
          <view class="col">
            <view class="title">活动时间</view>
            <view class="form-input">{{ dyData.actTimeStart }} ~ {{ dyData.actTimeEnd }}</view>
          </view>
        </template>

        <view class="col" v-if="dyData.isUrgent === 1">
          <view class="title">是否加急</view>
          <view class="form-input">加急</view>
        </view>
      </view>

      <view class="audit-status">
        <view class="audit-ing" v-if="isuInfoView.status === 2 && isuInfoView.auditStatus === 0">
          <view class="result">
            <text class="desc">内容正在审核中...</text>
          </view>
        </view>
        <view class="audit-refuse" v-else-if="isuInfoView.status === 3 && (isuInfoView.auditStatus === 2 || isuInfoView.auditStatus === 4)">
          <view class="result">
            <text class="desc">内容审核不通过</text>
          </view>
          <view class="memo" v-if="isuInfoView.auditExplain">
            <text class="lab">不通过原因</text>
            <text class="desc">{{ isuInfoView.auditExplain || ''}}</text>
          </view>
        </view>
      </view>

      <view class="join-list">
        <view class="join-title">
          <text>接单人员:</text>
        </view>
        <!--无接单人时-->
        <view class="list-item" v-if="!joinList || !joinList.length">
          <!--甲方显示状态-->
          <template v-if="isuInfoView.isIsuer === 1">
            <view class="join-stat-line">
              <template v-if="spfs.runingStatus === 0">
                <view class="stat">
                  <text>代办任务准备中...</text>
                </view>
              </template>
              <template v-if="[1, 2].includes(spfs.runingStatus)">
                <view class="stat">
                  <text>暂无人员接单, 请耐心等待...</text>
                </view>
              </template>
              <template v-else-if="spfs.runingStatus === 3">
                <view class="stat">你已取消了代办任务</view>
              </template>
              <template v-else-if="spfs.runingStatus === 6">
                <view class="stat">代办任务已结束</view>
              </template>
            </view>
          </template>
          <template v-else>
            <!-- 非参与人看到的状态提示(甲方能看到所有参与人、乙方仅能看到自己)-->
            <view class="join-stat-line">
              <template v-if="spfs.runingStatus === 0">
                <view class="stat">代办任务准备中...</view>
              </template>
              <template v-else-if="spfs.runingStatus === 1">
                <view class="stat">正在等待接单中...</view>
              </template>
              <template v-else-if="spfs.runingStatus === 2">
                <view class="stat">发布人已暂停了代办任务接单</view>
              </template>
              <template v-else-if="spfs.runingStatus === 3">
                <view class="stat">发布人已取消了代办任务</view>
              </template>
            </view>
          </template>
        </view>
        <!--有接单人时-->
        <view class="list-item" v-for="item in joinList" :key="item.joinId">
          <view class="auth-line-a">
            <view class="left">
              <view class="avator" v-if="joinUsers[item.joinUid].avatarUrl">
                <image class="avatar" :src="joinUsers[item.joinUid].avatarUrl" mode=""></image>
              </view>
              <view class="auth">
                <view class="auth-name">{{ joinUsers[item.joinUid].nickName }}</view>
                <view class="auth-time">{{ item.joinTime }}</view>
              </view>
            </view>
            <view class="right">
              <!-- 甲方操作区 -->
              <view class="auth-op" v-if="isuInfoView.isIsuer === 1">
                <view class="opt-btn tel" v-if="joinUsers[item.joinUid].mobile" @click="makePhone(joinUsers[item.joinUid].mobile)">
                  <text class="myicon icon-c002dianhua"></text>
                  <text>电话联系</text>
                </view>
              </view>
              <!-- 乙方操作区 -->
              <view class="auth-op" v-else> </view>
            </view>
          </view>

          <view class="content">
            <!-- 甲方可看乙方全部信息、参与者可看到自己全部信息 -->
            <template v-if="isuInfoView.isIsuer === 1 || item.joinerInfo.isSelf">
              <text>{{ item.joinerInfo.nickName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinPhone }}</text>
            </template>
            <!-- 乙方可看他人掩码信息 -->
            <template v-else-if="isJoin">
              <text>{{ item.joinerInfo.maskName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.maskPhone }}</text>
            </template>
            <!-- 非参与人只可看参与者名称掩码信息 -->
            <template v-else>
              <text>{{ item.joinerInfo.maskName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.maskPhone }}</text>
            </template>
          </view>

          <!-- 参与状态信息 -->
          <view class="join-stat-line">
            <!-- 甲方看到的参与者状态提示 -->
            <template v-if="isuInfoView.isIsuer === 1">
              <template v-if="spfs.runingStatus === 2">
                <view class="stat">代办任务已暂停接单</view>
              </template>
              <template v-else-if="spfs.runingStatus === 3">
                <view class="stat">代办任务已下架</view>
              </template>
              <!-- runingStatus=4为已存在乙方接单状态，runingStatus=5为乙方已全部任务完成状态 -->
              <template v-else-if="[4,5,6,7].includes(spfs.runingStatus)">
                <template v-if="item.joinStatus === 1">
                  <!-- 乙方接单状态 -->
                  <view class="stat">接单人正在尽力办理中...</view>
                </template>
                <template v-else-if="item.joinStatus === 2">
                  <!-- 乙方申请取消接单 -->
                  <template v-if="!item.a2bCancel || item.a2bCancel === 0">
                    <view class="stat">
                      <text>接单人取消了接单。取消原由：</text>
                      <text style="color: #d12c73;">{{ item.bCancelReson }}</text>
                    </view>
                    <view class="stat">你是否同意？</view>
                  </template>
                  <template v-else-if="item.a2bCancel === 1">
                    <view class="stat">你已同意了该接单人的取消请求,接单人已无偿退出</view>
                  </template>
                </template>
                <template v-else-if="item.joinStatus === 3">
                  <template v-if="item.bCancelStatus === 1 && item.a2bCancel === 2">
                    <view class="stat">你拒绝了该接单人的取消请求,接单人需继续完成代办任务</view>
                  </template>
                </template>
                <template v-else-if="item.joinStatus === 5">
                  <view class="stat" v-if="!item.aConfirmFinishTime || item.aConfirmFinishRes === 0">
                    <text>该接单人已完成了接单任务，请你尽快对该接单人的完成结果进行确认</text>
                  </view>
                  <view class="stat" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 1">
                    <text>你已确认该接单人任务完成，接单人酬金已结算支付</text>
                  </view>
                  <view class="stat" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 2">
                    <text>你已认定该接单人</text>
                    <text style="color:#d95a9d; font-weight: 600;">[任务未完成]</text>
                    <text>,在【</text>
                    <text style="color:#d95a9d;">{{ item.settleEndTime }}</text>
                    <text>】前，你仍可更改认定结果为</text>
                    <text style="color:#30a03c; font-weight: 600;">确认完成</text>
                  </view>
                </template>
                <template v-else-if="item.joinStatus === 6">
                  <view class="stat">你已确认该接单人任务完成，接单人赏金已支付</view>
                </template>
              </template>
            </template>
            <!-- 接单者本人状态提示 -->
            <template v-else-if="item.joinerInfo.isSelf">
              <template v-if="[4,5,6,7].includes(spfs.runingStatus)">
                <template v-if="item.joinStatus === 1">
                  <!-- 乙方接单状态 -->
                  <view class="stat">你已接单代办任务，请尽快完成...</view>
                </template>
                <template v-else-if="item.joinStatus === 2">
                  <!-- 乙方申请取消接单 -->
                  <template v-if="item.bCancelStatus === 1">
                    <template v-if="!item.a2bCancel || item.a2bCancel === 0">
                      <view class="stat">
                        <text>你取消了接单任务，理由是:</text>
                        <text style="color: #d12c73;">{{ item.bCancelReson }}</text>
                        <text>。</text>
                      </view>
                      <view class="stat">
                        <text>正在等待发布人同意...</text>
                      </view>
                      <view class="stat">
                        <text>你也可以改变主意，继续完成代办任务</text>
                      </view>
                    </template>
                    <template v-else-if="item.a2bCancel === 1">
                      <view class="stat">发布人已同意了你的取消接单请求,你无需支付任何费用，已正常退出。</view>
                    </template>
                  </template>
                </template>
                <template v-else-if="item.joinStatus === 3">
                  <template v-if="item.bCancelStatus === 1 && item.a2bCancel === 2">
                    <view class="stat">发布人拒绝了你的取消接单请求,你需要继续完成代办任务</view>
                  </template>
                </template>
                <template v-else-if="item.joinStatus === 5">
                  <view class="stat" v-if="!item.aConfirmFinishTime || item.aConfirmFinishRes === 0">
                    <text>你已完成了接单任务，请尽快联系发布人对你的完成结果进行确认</text>
                  </view>
                  <view class="stat" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 1">
                    <text>发布人已确认你完成了接单任务，任务赏金已结算支付，请尽快查收</text>
                  </view>
                  <view class="stat" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 2">
                    <text>发布人已认定你</text>
                    <text style="color:#d95a9d; font-weight: 600;">[任务未完成]</text>
                    <text>,如果你确实已完成代办任务，务必要在【</text>
                    <text style="color:#d95a9d;">{{ item.settleEndTime }}</text>
                    <text>】前联系发布人更改任务完成状态，否则你不仅得不到赏金，还会被平台认定为</text>
                    <text style="color:#30a03c; font-weight: 600;">“不诚实”</text>
                    <text>而受到处罚。</text>
                  </view>
                </template>
                <template v-else-if="item.joinStatus === 6">
                  <view class="stat">发布人已确认你完成了接单任务，任务赏金已结算支付，请尽快查收</view>
                </template>
              </template>
            </template>
            <template v-else>
              <!-- 其他参与者看到的当前接单者状态 -->
              <template v-if="[4,5,6,7].includes(spfs.runingStatus)">
                <template v-if="[1,2,3].includes(item.joinStatus)">
                  <view class="stat">接单人正在完成中...</view>
                </template>
                <template v-else-if="item.joinStatus === 5">
                  <view class="stat">
                    <text>接单人已完成任务</text>
                  </view>
                </template>
                <template v-else-if="item.joinStatus === 6">
                  <view class="stat">接单任务已完成，赏金已支付</view>
                </template>
              </template>
            </template>
          </view>

          <!-- 参与操作行 -->
          <view class="join-opt-line">
            <!-- 甲方操作 -->
            <template v-if="isuInfoView.isIsuer === 1">
              <template v-if="[4,5,6,7].includes(spfs.runingStatus)">
                <template v-if="item.joinStatus === 2">
                  <template v-if="item.bCancelTime && item.bCancelStatus === 1">
                    <template v-if="!item.a2bCancel || item.a2bCancel === 0">
                      <view class="opt-btn" @click="a2bTaskCancel(item.joinId, 1)">同意取消</view>
                      <view class="opt-btn cancel" @click="a2bTaskCancel(item.joinId, 2)">不同意</view>
                    </template>
                  </template>
                </template>
                <template v-else-if="item.joinStatus === 5">
                  <view class="opt-btn refuse" style="width: 175rpx;" v-if="!item.aConfirmFinishTime || item.aConfirmFinishRes === 0" @click="showA2bFinishOk(item.joinId, 2)">任务未完成</view>
                  <view class="opt-btn" style="width: 175rpx;" @click="showA2bFinishOk(item.joinId, 1)">确认已完成</view>
                </template>
              </template>
            </template>
            <!-- 乙方操作 -->
            <template v-else-if="isJoin"> </template>
            <!-- 访客操作 -->
            <template v-else></template>
          </view>
        </view>
      </view>

      <view class="footer">
        <!-- 甲方操作区 -->
        <view class="op" v-if="isuInfoView.isIsuer === 1">
          <template v-if="spfs.runingStatus === 0">
            <view class="stat-txt">代办任务准备中...</view>
            <view class="op-btn" @click="editIsuThis(0)">编辑</view>
            <view class="op-btn" @click="aTaskPull(false)">任务取消</view>
          </template>
          <template v-else-if="spfs.runingStatus === 1">
            <view class="stat-txt">正在等待他人接单...</view>
            <view class="op-btn" @click="editIsuThis(1)">编辑</view>
            <view class="op-btn" @click="chgAgentStatus(2)">暂停接单</view>
            <view class="op-btn" @click="aTaskPull(false)">任务取消</view>
          </template>
          <template v-else-if="spfs.runingStatus === 2">
            <view class="stat-txt">
              <text v-if="haveJoin > 0">已有{{ haveJoin }}人接单，当前</text>
              <text>你已暂停代办任务接单...</text>
            </view>
            <view class="op-btn" v-if="haveJoin === 0" @click="editIsuThis(2)">编辑</view>
            <view class="op-btn" @click="chgAgentStatus(1)">继续接单</view>
            <view class="op-btn" @click="aTaskPull(false)">任务取消</view>
          </template>
          <template v-else-if="spfs.runingStatus === 3">
            <view class="stat-txt">你取消了代办任务...</view>
            <view class="op-btn disabled">已取消</view>
          </template>
          <template v-else-if="spfs.runingStatus === 4">
            <view class="stat-txt">当前已接单{{ haveJoin }}人，完成代办任务还需要{{ lastToJoin }}人</view>
            <!--当所有接单人都已结算，只是人数不够时，发布人也可暂停、继续、取消-->
            <view class="op-btn" @click="chgAgentStatus(2)">暂停接单</view>
            <view class="op-btn" @click="aTaskPull(false)">任务取消</view>
          </template>
          <template v-else-if="spfs.runingStatus === 5">
            <view class="stat-txt">接单人正在完成代办任务...</view>
            <view class="op-btn disabled">进行中</view>
          </template>
          <template v-else-if="spfs.runingStatus === 6">
            <view class="stat-txt" v-if="!item.aConfirmFinishTime || item.aConfirmFinishRes === 0">
              <text>接单人已完成了代办任务，正在等待你确认完成结果...</text>
            </view>
            <view class="stat-txt" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 1">
              <text>接单人已完成了代办任务，你已确认任务完成，接单人酬金已结算支付</text>
            </view>
            <view class="stat-txt" v-else-if="item.aConfirmFinishTime && item.aConfirmFinishRes === 2">
              <text>接单人已完成了代办任务，但你已认定接单人</text>
              <text>任务未完成</text>
              <text>,在</text>
              <text>{{ item.settleEndTime }}</text>
              <text>前，你仍可对接单人的完成结果更改为</text>
              <text>确认完成</text>
            </view>
            <view class="op-btn disabled">进行中</view>
          </template>
          <template v-else-if="spfs.runingStatus === 7">
            <view class="op-btn disabled" v-if="spfs.settleDoneFlag === 0">结算中</view>
            <view class="op-btn disabled" v-else>已完结</view>
          </template>
        </view>
        <!-- 乙方操作区 -->
        <view class="op" v-else>
          <!-- 接单人操作栏 -->
          <template v-if="isJoin && myJoin">
            <template v-if="[4,5,6,7].includes(spfs.runingStatus)">
              <template v-if="myJoin.joinStatus === 1">
                <!--接单人申请取消-->
                <view v-if="myJoin.bCancelStatus === 0" class="op-btn" @click="showBCancelApply">取消接单</view>
                <view class="op-btn" @click="showbFinishJoinTask">任务完成</view>
              </template>
              <template v-else-if="myJoin.joinStatus === 2">
                <view v-if="myJoin.bCancelStatus === 1 && myJoin.a2bCancel === 0" class="op-btn disabled">请求取消中...</view>
                <view class="op-btn" @click="showbFinishJoinTask">任务完成</view>
              </template>
              <template v-else-if="myJoin.joinStatus === 3">
                <!-- 接单人申请取消后，发布人拒绝，接单人强行取消 -->
                <view v-if="myJoin.bCancelStatus === 1 && myJoin.a2bCancel === 2" class="op-btn" @click="showBCancelStick">强行取消</view>
                <view class="op-btn" @click="showbFinishJoinTask">任务完成</view>
              </template>
              <template v-else-if="myJoin.joinStatus === 5">
                <view class="op-btn disabled" v-if="!myJoin.aConfirmFinishTime || myJoin.aConfirmFinishRes === 0">待完成确认</view>
                <template v-else-if="myJoin.aConfirmFinishTime && myJoin.aConfirmFinishRes === 2">
                  <view class="stat-txt">发布人已认定你“任务未完成”，请尽快与发布人联系并确认结果,否则造成损失自行承担...</view>
                  <view class="op-btn disabled">确认未完成</view>
                </template>
              </template>
              <template v-else-if="myJoin.joinStatus === 6">
                <view class="op-btn disabled" v-if="spfs.settleDoneFlag === 0">待结算</view>
                <view class="op-btn disabled" v-else>已完结</view>
              </template>
            </template>
          </template>
          <!-- 非接单人操作栏 -->
          <template v-else>
            <view class="op-btn" v-if="spfs.runingStatus === 1" @click="showJoinApply">接单</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === 2">已暂停接单</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === 3">已取消</view>
            <template  v-else-if="spfs.runingStatus === 4">
              <view class="stat-txt">当前已接单{{ haveJoin }}人， 完成代办任务还需要{{ lastToJoin }}人</view>
              <view class="op-btn" @click="showJoinApply">接单</view>
            </template>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === 5">进行中</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === 6">已完成</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === 7">已完结</view>
          </template>
        </view>
      </view>
    </view>

    <u-popup :show="joinApplyForm.show" :round="10" mode="bottom" overlayStyle="{background: 'rgba(3, 100, 219, 0.5)'}" @close="joinPopClose">
      <view class="join-apply">
        <form @submit="joinSubmit">
          <view class="form-section form-block">
            <view class="bottom-line title">留下你的电话以便发布人联系你</view>
            <view class="col">
              <view class="lab">称呼</view>
              <view class="form-input">
                <input type="text" name="nickName" :value="joinForm.nickName" placeholder="你的称呼" />
              </view>
            </view>
            <view class="col">
              <text class="lab">电话</text>
              <view class="form-input">
                <input type="number" name="phone" :value="joinForm.phone" placeholder="你的电话" />
              </view>
            </view>
          </view>
          <view class="opt">
            <button class="submit" :class="{ disabled: !canJoin }" :disabled="!canJoin" form-type="submit">确定</button>
            <button class="cancel" type="default" @click="joinApplyForm.show = false">取消</button>
          </view>
        </form>
      </view>
    </u-popup>

    <u-popup :show="rewardUpdForm.show" :round="10" mode="bottom" overlayStyle="{background: 'rgba(3, 100, 219, 0.5)'}" @close="rewardUpdForm.show = false">
      <view class="join-apply">
        <form @submit="addReward">
          <view class="form-section form-block">
            <view class="bottom-line title">输入新的赏金额度</view>
            <view class="col">
              <view class="lab">当前赏金</view>
              <view class="form-input">
                <input type="number" name="reward" :value="dyData.reward" :disabled="true" placeholder="当前赏金额度" />
              </view>
              <view style="width: 300rpx">元</view>
            </view>
            <view class="col">
              <view class="lab">新的赏金</view>
              <view class="form-input">
                <input type="number" name="newReward" :value="dyData.reward" placeholder="新的赏金额度" />
              </view>
              <view style="width: 300rpx">元</view>
            </view>
          </view>
          <view class="opt">
            <button class="submit" form-type="submit">确定</button>
            <button class="cancel" type="default" @click="rewardUpdForm.show = false">取消</button>
          </view>
        </form>
      </view>
    </u-popup>

    <!-- 评论表单发布区 -->
    <commentPub
      v-if="commForm.show"
      :isShow="commForm.show"
      :bizType="commForm.bizType"
      :placeholder="commForm.placeholder"
      :sendText="commForm.sendText"
      @close="commForm.show = false"
      @sendPub="sendComment"></commentPub>

    <!-- 统一的alert对话框 -->
    <u-modal
      :show="alertModel.show"
      :title="alertModel.title"
      :content="alertModel.content"
      :closeOnClickOverlay="alertModel.closeOnClickOverlay"
      @confirm="alertClose"
      @close="alertClose"></u-modal>

    <!-- 统一的用户确认对话框 -->
    <u-modal
      :show="confirmModel.show"
      :closeOnClickOverlay="true"
      :showCancelButton="true"
      :title="confirmModel.title"
      @confirm="confirmOk(confirmModel.bizType, confirmModel.cfmData)"
      @cancel="confirmCancel"
      @close="confirmCancel">
      <view class="slot-content" :style="{ 'font-size': confirmModel.fontSize ? confirmModel.fontSize : '33rpx' }">
        <view v-if="confirmModel.showNote" class="confim-note" style="color: #ff9900">{{ confirmModel.showNote }}</view>
        <view>
          <text>{{ confirmModel.content }}</text>
        </view>
      </view>
    </u-modal>

    <payment ref="payPop" :payChannelAry="payChannelAry" :isCoupon="false" @checkPay="checkPay"
      @closePayment="closePayment"></payment>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty, isNotEmpty } from '@/utils/validate'

import payment from '@/common/components/Payment'
import commentPub from '@/common/components/comment/comment-pub.vue'

import formPay from '@/common/js/form/form-pay.js'
import consdef from '@/common/js/constant/consdef.js'

import appstate from '@/libs/appstate'
import dictLib from '@/libs/dict'

import { getUserInfos, getUserAccount } from '@/api/user'
import { getIsuCateById } from '@/libs/isucate'
import surety from '@/api/surety'
import {
  agentUpdSpecl,
  agentAPaidAfter,
  agentUpdReward,
  agentJoinApply,
  agentPreJoinApply,
  agentJoinStat,
  agentATaskPull,
  agentBCancelApply,
  agentA2bCancelRefuse,
  agentA2bCancelAgree,
  agentBCancelStick,
  agentBFinishJoinTask,
  agentA2bFinishTask
} from '@/api/isuJoin'

export default {
  name: 'agent-detail',
  components: {
    commentPub,
    payment
  },
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    },
    // 信息类目
    infoCate: {
      type: Object,
      default: () => {}
    },
    // 上级类目
    parCate: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const $d3 = formPay.data()

    return {
      infoData: {},
      // infoCate: {},

      // 原信息
      isuInfoView: {},
      isuUserInfo: {},
      commLive: {},
      dyData: {
        reward: '0.00'
      },
      spfs: {},
      // 信息附件图片
      imgUrls: [],

      askSpeed: [...dictLib.askSpeed1],
      workerRange: [...dictLib.workerRange1],
      pickAskSpeed: dictLib.askSpeed1[0],
      pickWorker: dictLib.workerRange1[0],
      pickTrashSize: dictLib.trashSize1[0],

      // 评论表单对象
      joinApplyForm: {
        show: false,
        content: ''
      },

      // 评论/回复表单对象
      commForm: {
        show: false,
        bizType: '',
        placeholder: '给出中途取消任务的理由',
        sendText: '确定',
        content: ''
      },

      // 弹出临时表单对象
      rewardUpdForm: {
        show: false,
        formTitle: '',
        sendText: '确定',
        isCancel: true
      },

      // 响应表单
      joinForm: {
        nickName: '',
        phone: ''
      },

      canJoin: true, // 是否可参与
      joinList: [],
      joinUsers: {}, //

      isJoin: false, // 当前用户是否已参与
      myJoin: {}, // 当前用户的参与记录
      isSingleJoin: true, // 是否唯一参与人任务
      haveJoin: 0, // 已接单数
      lastToJoin: 1, // 还需要接单人数

      alertModel: {
        show: false,
        title: '',
        content: '',
        closeOnClickOverlay: true
      },
      confirmModel: {
        bizType: 0, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划
        show: false,
        showNote: undefined, // 是否显示注意提示
        title: '',
        content: '',
        fontSize: '33rpx',
        closeOnClickOverlay: true
      },

      joinListInterval: null,

      taskRunStatus: {
        ...consdef.issue.agentTaskRunStatus
      },

      ...$d3
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      isLogin: 'user/isLogin',
      locIsuPreUrl: 'app/locIsuPreUrl',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    const _that = this
    if (_that.joinListInterval) {
      clearInterval(_that.joinListInterval)
    }
  },
  watch: {
    infoDetail: {
      handler: function (newVal) {
        this.infoData = newVal
        this.init()
      },
      deep: true
    }
  },
  methods: {
    ...formPay.methods,

    init() {
      const _that = this
      if (this.infoData) {
        const { userLiveInfo, dyFormData, speclFields, imgUrls, ...isuInfo } = { ...this.infoData }
        if (isuInfo) {
          _that.isuInfoView = isuInfo
        }

        getIsuCateById(_that.infoData.cateId).then((r) => {
          _that.infoCate = r
        })

        _that.loadInfoData(imgUrls, dyFormData, speclFields)

        if (userLiveInfo) {
          const { userInfo, commLive } = { ...userLiveInfo }
          _that.isuUserInfo = userInfo
          _that.commLive = commLive
          if (_that.isuUserInfo) {
            const avatarUrl = _that.isuUserInfo.avatarUrl
            if (avatarUrl && !this.$util.isRemoteUrl(avatarUrl) && this.$util.startWith(avatarUrl, 'f/')) {
              this.isuUserInfo.avatarUrl = this.locComPreUrl + avatarUrl
            }
          }
        }

        _that.intervalJoinList()
      }
    },

    /**
     * 图片预览
     * @param {*} idx
     */
    previewImage(idx) {
      const _that = this
      uni.previewImage({
        current: idx, // 当前显示图片的http链接
        urls: _that.imgUrls // 需要预览的图片http链接列表
      })
    },

    // 上拉刷新
    reachBottom() {
      this.intervalJoinList()
    },

    /**
     * 单独处理信息内容
     */
    loadInfoData(pImgUrls, dyFormData, speclFields) {
      const _that = this
      if (isNotEmpty(pImgUrls)) {
        const infoImgs = JSON.parse(pImgUrls)
        this.imgUrls = infoImgs.map((el) => {
          if (!this.$util.isRemoteUrl(el.url) && this.$util.startWith(el.url, 'f/')) {
            return _that.locIsuPreUrl + el.url
          } else {
            return el.url
          }
        })
      }

      if (isNotEmpty(dyFormData)) {
        // const dyData = dyFormData
        _that.dyData = dyFormData

        if (_that.dyData.bizType === 'take' || _that.dyData.bizType === 'sent') {
          _that.pickAskSpeed = _that.askSpeed.find((el) => el.v === _that.dyData.arriveAsk)
          _that.pickWorker = dictLib.workerRange1.find((el) => el.v === _that.dyData.workerLimit)
        } else if (_that.dyData.bizType === 'do') {
          _that.pickWorker = dictLib.workerRange2.find((el) => el.v === _that.dyData.workerLimit)
        } else if (_that.dyData.bizType === 'buy') {
          _that.pickAskSpeed = _that.askSpeed.find((el) => el.v === _that.dyData.arriveAsk)
          _that.pickWorker = dictLib.workerRange3.find((el) => el.v === _that.dyData.workerLimit)
        } else if (_that.dyData.bizType === 'trash') {
          _that.pickTrashSize = dictLib.trashSize1.find((el) => el.v === _that.dyData.trashSize)
        } else if (_that.dyData.bizType === 'with') {
        }
      }

      // 专有内容
      if (isNotEmpty(speclFields)) {
        // _that.spfs = JSON.parse(speclFields)
        _that.spfs = speclFields
      }
    },

    intervalJoinList() {
      const _that = this
      if (_that.joinListInterval) {
        clearInterval(_that.joinListInterval)
      }
      // 设置间隔为1分钟
      _that.joinListInterval = setInterval(
        (function () {
          const fn = function () {
            if (_that.isuInfoView.isIsuer === 1) {
              // 甲方可看所有响应用户
              _that.getJoinStat(0)
            } else if (_that.isuInfoView.isIsuer !== 1) {
              // 非甲方仅看到本人的响应记录
              _that.getJoinStat(0)
            }
          }
          fn()
          return fn
        })(),
        1000 * 60
      )
    },

    /**
     * 拨打电话
     */
    makePhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      })
    },

    /**
     * 增加赏金
     */
    addReward(e) {
      const _that = this
      const rwData = e.detail.value
      if (rwData.newReward < rwData.reward) {
        _that.$uniUtil.tips({ title: '不支持下调赏金' })
        return false
      } else if (rwData.newReward === rwData.reward) {
        _that.$uniUtil.tips({ title: '未作调整' })
        return false
      } else {
        const reqVo = {
          isuId: this.infoData.isuId,
          comId: this.infoData.comId,
          cateName: this.infoCate.cateName,
          reward: rwData.newReward
        }

        agentUpdReward(reqVo).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.rewardUpdForm.show = false
              _that.$uniUtil.tips({ title: '赏金调整成功' })
              _that.intervalJoinList()
            } else {
              _that.$uniUtil.tips({ title: '赏金调整失败' })
            }
          }
        })
      }
    },

    /**
     * alert对话框关闭
     */
    alertClose() {
      const _that = this
      setTimeout(function () {
        _that.alertModel = {
          show: false,
          title: '',
          content: '',
          closeOnClickOverlay: true
        }
      }, 500)
    },

    /**
     * 对话框取消或关闭
     */
    confirmCancel() {
      const _that = this
      setTimeout(function () {
        _that.confirmModel = {
          bizType: 0, // 0:不显示
          show: false,
          showNote: undefined, // 是否显示注意提示
          title: '',
          content: ''
        }
      }, 500)
    },

    /**
     * 用户确认对话框的确认操作
     * bizType: 业务类型 0:不显示, 1：甲方取消任务计划，2:乙方接单，3 乙方取消接单,4.乙方强行取消接单，5甲方确认任务完成
     * cfmData: 确认时传递的数据
     */
    confirmOk(bizType, cfmData) {
      this.confirmCancel()
      if (bizType === 1) {
        // 1：甲方取消任务
        this.aTaskPull(true)
      } else if (bizType === 2) {
        // 2:乙方接单
        this.toApplyJoin()
      } else if (bizType === 3) {
        // 3 乙方取消接单
        this.bToCancel()
      } else if (bizType === 4) {
        // 4.乙方强行取消接单
        this.bCancelTaskStick()
      } else if (bizType === 5) {
        // 乙方完成任务
        this.bFinishJoinTask()
      } else if (bizType === 6) {
        // 甲方确认完成
        this.a2bFinishOk(cfmData, 1)
      } else if (bizType === 7) {
        // 甲方确认未完成
        this.a2bFinishOk(cfmData, 2)
      } else if (bizType === 9) {
        // 任务完成评价
        this.aCfirmBDegree(cfmData)
      }
    },

    /**
     * 回复对话框结果
     */
    sendComment(bizType, content) {
      if (bizType === 'bCancelTask') {
        this.bCancelApply(content)
      }
    },

    /**
     * 获取用户参与响应列表
     */
    getJoinStat(listType) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        comId: this.infoData.comId,
        cateName: this.infoCate.cateName,
        joinListType: listType
      }
      agentJoinStat(reqVo).then((res) => {
        uni.hideLoading()
        if (res.code === 0) {
          const _res = res.data
          const { dyFormData, speclFields, imgUrls, ...infoData } = { ..._res.isuInfo }
          _that.infoData = infoData
          const joinList = _res.joinList

          // 如果参与者已达最大数，不可再接单
          if (speclFields.runingStatus === 5) {
            _that.canJoin = false
          }

          _that.loadInfoData(imgUrls, dyFormData, speclFields)
          // 专有内容
          // if (isNotEmpty(_that.infoData.speclFields)) {
          //  _that.spfs = JSON.parse(_that.infoData.speclFields)
          // }
          //if (isNotEmpty(_that.infoData.speclFields)) {
          // _that.spfs = _that.infoData.speclFields
          //}

          _that.joinList = []
          let joinUids = []
          _that.myJoin = {}
          _that.isJoin = false

          joinList.forEach((el) => {
            if (el.joinTxt) {
              el.joinerInfo = JSON.parse(el.joinTxt)
              if (isNotEmpty(el.joinerInfo.nickName)) {
                el.joinerInfo.maskName = el.joinerInfo.nickName.substr(0, 1) + '**'
              }
            }

            if (isNotEmpty(el.joinPhone)) {
              el.maskPhone = el.joinPhone.substr(0,2) + '***' + el.joinPhone.substr(el.joinPhone.length - 1)
            }

            _that.joinList.push(el)

            const juid = Number(el.joinUid)
            if (!joinUids.includes(juid)) {
              joinUids.push(juid)
            }

            if (juid === _that.uid) {
              el.joinerInfo.isSelf = true // 参与者自己
              _that.myJoin = { ...el }
              _that.isJoin = true

              // 当前用户已是接单人，不可再接单
              _that.canJoin = false
            } else {
              el.joinerInfo.isSelf = false // 其他参与者
            }
          })

          const maxJoiner = dyFormData.joinerNum || 1

          if (_that.joinList.length > 0) {
            _that.isSingleJoin = false
             _that.haveJoin = _that.joinList.length
            _that.lastToJoin = maxJoiner - _that.haveJoin
          }

          if (joinUids.length > 0) {
            // 获取参与人的用户信息
            getUserInfos(joinUids).then((res2) => {
              if (res2.code === 0) {
                const _res2 = res2.data
                _that.joinUsers = {}
                if (_res2 && Array.isArray(_res2)) {
                  _res2.forEach((el) => {
                    if (el) {
                      const juInfo = { ...el }
                      const avatarUrl = juInfo.avatarUrl
                      if (!_that.$util.isRemoteUrl(avatarUrl) && _that.$util.startWith(avatarUrl, 'f/')) {
                        juInfo.avatarUrl = _that.locComPreUrl + avatarUrl
                      }
                      _that.joinUsers[el.uid] = juInfo
                    }
                  })
                }
              }
            })
          }
        }
      })
    },

    /**
     * 更换招工状态
     */
    chgAgentStatus(v) {
      const _that = this
      if (v !== 1 && v !== 2) {
        return false
      }

      let run = v
      if (v === 1 && _that.haveJoin > 0) {
        // 存在接单者，主信息运行状态值为4,表示存在接单人，但未达到最大人数
        run = 4
      }

      const specl = {
        runingStatus: run 
      }

      const reqVo = {
        isuId: this.infoData.isuId,
        comId: this.infoData.comId,
        isuCateId: this.infoCate.cateId,
        specl: JSON.stringify(specl)
      }

      agentUpdSpecl(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          _that.intervalJoinList()
        }
      })
    },

    /**
     * 显示参与申请框
     */
    showJoinApply() {
      const _that = this
      const chkRes = appstate.checkLogin()
      if (!chkRes) {
        // 仅登录用户可以操作
        appstate.toLogin()
        return false
      }

      // 罚金为赏金的20%，且不低于1元、不超过4元
      const bCalcRecReward = Number(_that.dyData.bCalcRecReward)
      let forfeit = (bCalcRecReward * 0.2).toFixed(2) // 罚金
      if (forfeit < 1) {
        forfeit = 1
      } else if(forfeit > 4) {
        forfeit = 4
      }

      setTimeout(function () {
        _that.confirmModel = {
          bizType: 2, // 0:不显示, 1：甲方取消任务计划，2:乙方接单, 3:乙方申请取消接单
          show: true,
          showNote: '注意：', // 是否显示注意提示
          title: '',
          fontSize: '28rpx',
          content: `接单后将视为双方签订代理合约，如果中途取消,将承担赔付${forfeit}元(赏金额度的20%,且不低于1元)的违约金给发布人，确认继续接单？`
        }
      }, 500)
    },

    /**
     * 申请参与前提示
     */
    toApplyJoin() {
      const _that = this

      if (isEmpty(_that.joinForm.phone)) {
        // 缺省当前用户电话
        _that.joinForm.phone = _that.userInfo.mobile
      }

      _that.canJoin = true
      _that.joinApplyForm.show = true

      // 检查账户可用额
      /* 
      getUserAccount().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            const canUseRealAmount = _res.canUseRealAmount
            const reward = Number(_that.dyData.reward)
            let forfeit = (reward * 0.2).toFixed(2) // 保证金
            forfeit = forfeit < 1 ? 1 : forfeit
            // forfeit = forfeit > 2 ? 2 : forfeit

            if (canUseRealAmount < forfeit) {
              setTimeout(function () {
                _that.alertModel = {
                  show: true,
                  title: '',
                  content: `账户可用余额不足，需至少${forfeit}元的接单保证金!`,
                  closeOnClickOverlay: true
                }
              }, 500)
            } else {
              if (isEmpty(_that.joinForm.phone)) {
                // 缺省当前用户电话
                _that.joinForm.phone = _that.userInfo.mobile
              }

              _that.canJoin = true
              _that.joinApplyForm.show = true
            }
          }
        }
      })
        */
    },

    joinPopClose() {
      const _that = this
      _that.joinApplyForm.show = false
    },

    /**
     * 参与响应提交
     */
    joinSubmit(e) {
      this.canJoin = false // 防止重复参与
      const formData = e.detail.value
      // const joinTxt = JSON.stringify(formData)
      this.applyJoin(formData)
    },

    /**
     * 乙方申请参与
     */
    applyJoin(formData) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        comId: this.infoData.comId,
        isuCateId: this.infoData.cateId,
        cateName: this.infoCate.cateName,
        joinPhone: formData.phone,
        joinTxt: JSON.stringify({
          nickName: formData.nickName
        })
      }
      uni.showLoading({
        title: '正在提交...',
        mask: true
      })

      agentPreJoinApply(reqVo).then((res) => {
        if (res.code === 0) {
          _that.joinApplyForm.show = false
          uni.hideLoading()

          const _payData = res.data
          // 专有内容
          if (_payData) {
            const payAttach = {
              editType: 'bJoinApply' // 标记为参与申请时的支付
            }
            if (_payData.orderPayAmount > 0) {
              // 需要支付时，拉起支付方式选择框
              _that.goPay(_payData.orderId, _payData.orderPayAmount, _payData.feeAmount, payAttach)
            } 
          }
        }
      })

      /*
      agentJoinApply(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            _that.joinApplyForm.show = false
            _that.$uniUtil.tips({ title: '接单成功' })
            _that.intervalJoinList()
          }
        }
      })
      */
    },

    /**
     * 弹出乙方申请取消对话框
     */
    showBCancelApply() {
      const _that = this
      const chkRes = appstate.checkLogin()
      if (!chkRes) {
        // 仅登录用户可以操作
        appstate.toLogin()
        return false
      }

     // const reward = Number(_that.dyData.reward)
     // let forfeit = reward * 0.2 // 罚金
     // forfeit = forfeit < 1 ? 1 : forfeit > 2 ? 2 : forfeit

      setTimeout(function () {
        _that.confirmModel = {
          bizType: 3, // 0:不显示, 1：甲方取消任务计划，2:乙方接单, 3乙方申请取消接单
          show: true,
          showNote: '注意：', // 是否显示注意提示
          title: '',
          fontSize: '28rpx',
          content: `取消接单需与任务发布人协商，发布人同意后才可免费取消。是否继续？`
        }
      }, 500)
    },

    /**
     * 乙方取消任务弹出输取消理由的对话框
     */
    bToCancel() {
      const _that = this
      _that.commForm.placeholder = '给出中途取消任务的理由'
      _that.commForm.content = ''
      _that.commForm.bizType = 'bCancelTask'
      _that.commForm.show = true
      _that.commForm.sendText = '确定'
    },

    /**
     *乙方取消接单
     */
    bCancelApply(v) {
      const _that = this
      if (isEmpty(v)) {
        _that.$uniUtil.tips({ title: '必须有取消接单理由' })
        return false
      } else if (v.length > 30) {
        _that.$uniUtil.tips({ title: '取消接单理由20个字符内' })
        return false
      }

      const reqVo = {
        joinId: _that.myJoin.joinId,
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId,
        cateName: this.infoCate.cateName,
        joinTxt: v
      }
      agentBCancelApply(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            _that.commForm.show = false
            _that.$uniUtil.tips({ title: '取消接单成功' })
            _that.intervalJoinList()
          }
        }
      })
    },

    /**
     * 甲方同意或拒绝乙方任务取消
     */
    a2bTaskCancel(joinId, acpType) {
      const _that = this
      const reqVo = {
        joinId: joinId,
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId,
        cateName: this.infoCate.cateName
      }

      if (acpType === 1) {
        agentA2bCancelAgree(reqVo).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.$uniUtil.tips({ title: '已同意' })
              _that.intervalJoinList()
            } else {
              _that.$uniUtil.tips({ title: '操作失败' })
            }
          } else {
            _that.$uniUtil.tips({ title: '操作失败' })
          }
        })
      } else {
        agentA2bCancelRefuse(reqVo).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.$uniUtil.tips({ title: '已拒绝' })
              _that.intervalJoinList()
            } else {
              _that.$uniUtil.tips({ title: '操作失败' })
            }
          } else {
            _that.$uniUtil.tips({ title: '操作失败' })
          }
        })
      }
    },

    /**
     * 乙方强行取消接单任务前确认
     */
    showBCancelStick() {
      const _that = this
      setTimeout(function () {
        _that.confirmModel = {
          bizType: 4, // 0:不显示, 1：甲方取消任务计划，2:乙方接单, 3乙方申请取消接单,4乙方强行取消接单
          show: true,
          showNote: '注意：', // 是否显示注意提示
          title: '',
          fontSize: '28rpx',
          content: `强行取消接单,需支付${_that.myJoin.bJoinSurety}元违约金给发布人。是否继续？`
        }
      }, 500)
    },

    /**
     * 乙方强行取消接单任务
     */
    bCancelTaskStick() {
      const _that = this
      const reqVo = {
        joinId: _that.myJoin.joinId,
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId,
        cateName: this.infoCate.cateName
      }
      agentBCancelStick(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            _that.$uniUtil.tips({ title: '强行取消接单任务成功' })
            _that.intervalJoinList()
          } else {
            _that.$uniUtil.tips({ title: '操作失败' })
          }
        } else {
          _that.$uniUtil.tips({ title: '操作失败' })
        }
      })
    },

    /**
     * 甲方取消任务计划
     * 代办任务：仅限制甲方在无人接单的情况下取消
     */
    aTaskPull(isfirm) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        cateName: this.infoCate.cateName,
        isConfirm: isfirm === true ? true : false
      }
      agentATaskPull(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          const cancelType = _res.columns.cancelType
          if (cancelType === 2) {
            setTimeout(function () {
              _that.alertModel = {
                show: true,
                title: '',
                content: _res.columns.msg,
                closeOnClickOverlay: true
              }
            }, 500)
          } else if ([0, 1, 3].includes(cancelType)) {
            setTimeout(function () {
              _that.confirmModel = {
                bizType: 1, // 0:不显示, 1：甲方取消任务计划，2:乙方接单，3 乙方取消接单,4.乙方强行取消接单
                show: true,
                showNote: cancelType == 0 ? undefined : '注意:', // 是否显示注意提示
                title: '',
                content: _res.columns.msg + '确定取消？'
              }
            }, 500)
          } else if (cancelType === 8 || cancelType === 9) {
            // _that.$emit('reload')
            // 取消成功后，返回列表页
            this.$Router.back(1)
          }
        }
      })
    },

    showbFinishJoinTask(){
      const _that = this
        setTimeout(function () {
          _that.confirmModel = {
            bizType: 5, // 5乙方完成任务
            show: true,
            showNote: '特别提醒：', // 是否显示注意提示
            title: '',
            fontSize: '28rpx',
            content: `你当前正在"完成任务"。\n\n   如果你的完成结果未被发布人认可，你不仅得不到代办任务赏金，还会被平台认定为"不诚实"而罚没接单时支付的保证金。\n\n   因此建议你在完成此操作前，尽可能多与发布人沟通任务细节，以避免造成不必要的损失和邻里纠纷！\n\n    再次确认你确实已完成了代办任务？`
          }
        }, 500)
    },

    /**
     * 乙方完成任务
     */
    bFinishJoinTask() {
      const _that = this
      const reqVo = {
        joinId: _that.myJoin.joinId,
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId,
        cateName: this.infoCate.cateName
      }
      agentBFinishJoinTask(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            setTimeout(function () {
              _that.alertModel = {
                show: true,
                title: '',
                content: `你已完成任务，请等待发布人确认!`,
                closeOnClickOverlay: true
              }
            }, 500)
            _that.intervalJoinList()
          } else {
            _that.$uniUtil.tips({ title: '操作失败' })
          }
        } else {
          _that.$uniUtil.tips({ title: '操作失败' })
        }
      })
    },

    /**
     * 甲方确认任务已完成前确认
     */
    showA2bFinishOk(joinId, flag) {
      const _that = this
      if (flag === 1) {
        setTimeout(function () {
          _that.confirmModel = {
            bizType: 6, // 6甲方确认任务完成
            cfmData: joinId,
            show: true,
            showNote: '注意：', // 是否显示注意提示
            title: '',
            fontSize: '28rpx',
            content: `你正在确认任务“已完成”,已支付的待付赏金${_that.dyData.reward}元会立即划转支付(其中扣除平台运营费${_that.dyData.cutPlatAmount}元，支付接单人${_that.dyData.bCalcRecReward}元)。\n\n    确认任务已完成？`
          }
        }, 500)
      } else if(flag === 2) {
        setTimeout(function () {
          _that.confirmModel = {
            bizType: 7, // 7甲方确认任务未完成
            cfmData: joinId,
            show: true,
            showNote: '注意：', // 是否显示注意提示
            title: '',
            fontSize: '28rpx',
            content: `你正在认定任务“未完成”,但接单人已提交为“完成”，你当前的操作会让接单人不仅得不到任务赏金，还会被平台认定"不诚实"而受到处罚，由此可能导致产生邻里纠纷。\n\n    我们建议你一定慎重执行此操作！\n\n    即使你执行了此操作，后续24小时内你仍可点击“确认完成”而纠正此行为。\n\n    再次确认你是否认定任务未完成？`
          }
        }, 500)
      }

    },

    /**
     * 甲方确认任务已完成/未完成
     * finishFlag：1-已完成/2-未完成
     */
    a2bFinishOk(joinId, finishFlag) {
      const _that = this
      const reqVo = {
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId,
        cateName: this.infoCate.cateName,
        joinId: joinId,
        acptType: finishFlag
      }
      agentA2bFinishTask(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            _that.$uniUtil.tips({ title: '任务已完成' })
            _that.intervalJoinList()
          } else {
            _that.$uniUtil.tips({ title: '操作失败' })
          }
        } else {
          _that.$uniUtil.tips({ title: '操作失败' })
        }
      })
    },

    editIsuThis(flag) {
      const _that = this
      if (flag === 1) {
        _that.$uniUtil.tips({ title: '重新编辑前请先暂停代办', endtime: 3000 })
        return false
      }

      this.$Router.push({
        path: _that.infoCate.isuPagePath,
        query: {
          sCateId: _that.infoData.cateId,
          editType: 'edit',
          subEditType: flag === 0 ? 'fPush' : 'modify',
          orgIsuId: _that.infoData.isuId
        }
      })
    },

    /**
     * 选择支付方式后处理
     */
    checkPay(actPay) {
      const _that = this
      if (actPay && actPay.attach && actPay.attach.editType) {
        uni.showLoading({
            mask: true
        })

        const payChannelVal = actPay.payChannel.value
        this.pay.payChannel = payChannelVal

        const editType = actPay.attach.editType
        if (editType === 'bJoinApply') {
          // 乙方参与申请支付保证金
          _that.paidSurety(payChannelVal, actPay.payOrderCode, editType)
        } else if (editType === 'aAcceptOk') {
          // 甲方调整赏金
          _that.paidSurety(payChannelVal, actPay.payOrderCode, editType);
        } else {
          uni.hideLoading()
        }
      }
    },

    /**
     * 保证金支付处理
     * @param payChannel 
     * @param payOrderNo 
     */
    paidSurety(payChannelVal, payOrderNo, editType) {
      const _that = this
      if (payChannelVal === 'WRoutine') {
          // 微信支付
          _that.weixinPay(payChannelVal, payOrderNo, editType)
      } else if (payChannelVal === 'yue') {
          // 余额支付
          _that.yuePay(payChannelVal, payOrderNo, editType)
      } else {
        // 其它支付方式暂不支持
        console.log(payChannelVal)
      }
    },

    /**
     * 后端余额支付处理
     * @param {*} orderNo
     * @param {*} cateId
     */
    yuePay(payChannelVal, orderNo, editType) {
        const _that = this
        const req = {
            orderNo: orderNo,
            payChannel: payChannelVal
        }

        uni.showLoading({
          mask: true
        })

        surety.suretyPayForYuePaid(req).then((res) => {
            if (res.code === 0) {
              const _res = res.data
                // const { payOrderNo } = res.data
                surety.suretyPayForYueNotify({ 
                  payOrderNo: _res.payOrderNo,
                  outTradeNo: _res.outTradeNo
                }).then((res2) => {
                  uni.hideLoading()
                  if (res2.code === 0) {
                      const _res2 = res2.data
                      if (_res2.status) {
                          if (editType === 'bJoinApply') {
                              _that.$uniUtil.tips({ title: '申请成功' })
                          } else if (editType === 'aAcceptOk') {
                              _that.$uniUtil.tips({ title: '招工已完成' })
                          } 
                          
                          // 关闭支付弹窗
                          _that.payClose()
                          _that.intervalJoinList()
                      }
                  }
                })
            }
        })
    },

    /**
     * 微信支付处理
     * @param orderNo 
     */
    weixinPay(payChannelVal, orderNo, editType) {
        const _that = this
        const req = {
            orderNo: orderNo,
            payChannel: payChannelVal
        }

        uni.showLoading({
          mask: true
        })

        surety.suretyPayForWxPaid(req).then((res) => {
          const _res = res.data
          const wxPayConfig = _res.wxPayConfig
          const payOutTradeNo = _res.outTradeNo
          if (!wxPayConfig) {
            uni.hideLoading()
            return false
          }

          // #ifdef MP
          // 拉起微信支付弹窗
          uni.requestPayment({
              timeStamp: wxPayConfig.timeStamp,
              nonceStr: wxPayConfig.nonceStr,
              package: wxPayConfig.packageValue,
              signType: wxPayConfig.signType,
              paySign: wxPayConfig.paySign,
              success: function (wxRes) {
                  if (wxRes && wxRes.errMsg === 'requestPayment:ok') {
                      // 支付成功，关闭支付弹窗
                      _that.payClose()
                      _that.weixinPayAfter(payOutTradeNo, _res.payOrderNo, editType)
                  }
              },
              fail: function (e) {
                  if (e) {
                      if (e.errMsg === 'requestPayment:fail cancel') {
                          _that.$uniUtil.tips({ title: '用户取消支付' })
                      } else {
                          _that.$uniUtil.tips({ title: '支付失败' })
                      }
                  } else {
                      _that.$uniUtil.tips({ title: '支付失败' })
                  }
                  // 关闭支付弹窗
                  _that.payClose()
              },
              complete: function (e) {
                  uni.hideLoading()
              }
          })
          // #endif
          // #ifdef H5
          // #endif
        })
    },

    /**
     * 支付后处理
     */
    weixinPayAfter(payOutTradeNo, payOrderNo, editType) {
        const _that = this
        const req = {
            outTradeNo: payOutTradeNo,
            payOrderNo: payOrderNo
        }

        let count = 0
        _that.pay.payResInterval = setInterval(
            (function () {
                const fn = function () {
                  if (count > 15) {
                    // 清除定时任务
                    clearInterval(_that.pay.payResInterval)
                  }
                  
                    surety.suretyPayForWxPayRes(req).then((res) => {
                        count ++
                        if (res.code === 0) {
                            const _res = res.data
                            if (_res.status) {
                              if (editType === 'bJoinApply') {
                                  _that.$uniUtil.tips({ title: '申请成功' })
                              } else if (editType === 'aAcceptOk') {
                                  _that.$uniUtil.tips({ title: '招工已完成' })
                              } 
                              // 关闭支付弹窗
                              _that.payClose()
                              _that.intervalJoinList()
                              uni.hideLoading()

                              // 清除定时任务
                              clearInterval(_that.pay.payResInterval)
                            } else {
                                // 未支付成功
                                const errCode = _res.errCode
                                if (errCode) {
                                  if (errCode === 530) {
                                    // 微信支付已超时，查询支付结果已无必要
                                    _that.$uniUtil.tips({ title: '支付处理已超时，请联系客服退款' })
                                    
                                    // 清除定时任务
                                    clearInterval(_that.pay.payResInterval)
                                    uni.hideLoading()
                                  } else if(errCode === 531) {
                                    // 微信支付已失败，查询支付结果已无必要
                                    _that.$uniUtil.tips({ title: '微信支付失败，请稍后再试' })
                                    
                                    // 清除定时任务
                                    clearInterval(_that.pay.payResInterval)
                                    uni.hideLoading()
                                  }
                                } 
                            }
                        } else {
                            // 未支付成功
                            // uni.hideLoading()
                        }
                    });
                }
                fn()
                return fn
            })(),
            1000 * 10
        )

    }
  }
}
</script>

<style lang="scss" scoped>
.agent-detail-box {
  .body {
    padding: 10rpx;

    .info-title {
      margin: 20rpx 10rpx;
      font-size: 36rpx;
      font-weight: 700;
      color: #303133;
    }
    .info-isu {
    }

    .opt-btn {
      font-size: 28rpx;
      color: #fff;
      height: 50rpx;
      background-color: #dd6161;
      border-radius: 20rpx;
      text-align: center;
      line-height: 50rpx;
      margin-right: 20rpx;
      padding: 0 20rpx;
    }
    .opt-btn.disabled {
      background-color: #c8c9cc;
      color: #fff;
    }
    .opt-btn.normal {
      background-color: #fef0f0;
      color: #606266;
    }
    .opt-btn.cancel {
      background-color: #3c9cff;
    }
    .opt-btn.tel {
      background-color: #53c21d;
    }

    .auth-line-a {
      display: flex;
      justify-content: space-between;
      padding: 0 20rpx;

      .left {
        display: flex;

        .avator {
          width: 80rpx;
          height: 80rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .auth {
          margin-left: 20rpx;

          .auth-name {
            font-size: 28rpx;
            font-weight: 700;
          }

          .auth-time {
            font-size: 20rpx;
            margin: 10rpx 0;
          }
        }
      }
      .right {
        .auth-op {
          display: flex;
        }
      }
    }
    .content {
      margin: 20rpx 0rpx;
      padding: 20rpx;
      font-size: 33rpx;
      background: #fff;
      border-radius: 10rpx;
      min-height: 300rpx;
    }
    .img {
    }
    .info-fields {
      margin: 20rpx 0;
      border-radius: 10rpx;

      .col {
        display: flex;
        line-height: 50rpx;
        min-height: 50rpx;
        background: #fff;
        border-bottom: 1px dashed #f5f5f5;
        font-size: 33rpx;
        padding: 15rpx 28rpx;

        .title {
          width: 150rpx;
          font-weight: 600;

          &::after {
            content: ':';
          }
        }
        .form-input {
          flex: 1;
          margin-left: 20rpx;

          .field {
            margin-left: 10rpx;
          }
          .money {
            color: #ff9900;
            font-size: 48rpx;
          }
        }

        .op-btn {
          width: 200rpx;
          height: 56rpx;
          line-height: 56rpx;
          font-size: 28rpx;
          text-align: center;
          color: #fff;
          border-radius: 5%;
          padding: auto 10rpx;
          margin: auto 20rpx;
        }

        .call-phone {
          width: 200rpx;
          background-color: #e83323;
        }

        .add-reward {
          width: 160rpx;
          border-radius: 10%;
          background-color: #18b566;
          margin-left: 40rpx;
        }
      }
    }

    .audit-status {
      padding: 8rpx 12rpx;

      .audit-ing {
        .result {
          .desc {
            color: #e2ac49;
          }
        }
      }

      .audit-refuse {
        .result {
          .desc {
            color: #ec4542;
          }
        }

        .memo {
          .lab {
            &::after {
              content: ': ';
            }
          }

          .desc {
            color: #612bb6;
          }
        }
      }
    }

    .join-list {
      .join-title {
        font-size: 34rpx;
        margin: 20rpx 0 0;
        font-weight: 600;
        height: 60rpx;
        line-height: 60rpx;
        background-color: #71d5a1;
        padding-left: 20rpx;
      }

      .list-item {
        background: #fff;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .content {
          margin: 10rpx 0rpx;
          padding: 10rpx 20rpx;
          font-size: 33rpx;
          background: #fff;
          min-height: 60rpx;
        }

        .join-stat-line {
          padding: 0 15rpx;
          font-size: 28rpx;
          color: #2b85e4;
          margin-top: 10rpx;
        }

        .join-opt-line {
          margin-top: 10rpx;
          display: flex;
          justify-content: flex-end;

          .opt-btn {
            margin-right: 20rpx;
            width: 150rpx;
          }

          .degree {
            width: 700rpx;

            .lab {
              margin: 10rpx;
              width: 200rpx;
            }

            .slide,
            .reason {
              display: flex;
            }

            .reason {
              .check {
                margin: 10rpx 30rpx;

                label {
                  margin-right: 30rpx;
                }

                checkbox {
                  margin-right: 15rpx;
                }
              }
            }

            slider {
              width: 360rpx;
              margin: 10rpx 40rpx;
            }

            .dgee-cfm {
              display: flex;
              justify-content: flex-end;
              padding: 10rpx 30rpx;
            }
          }
        }
      }
    }

    .footer {
      width: 100%;
      height: 128rpx;
      background-color: #fff;
      padding: 0 30rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;

      .op {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;

        .stat-txt {
          margin-right: 50rpx;
        }

        .op-btn {
          font-size: 28rpx;
          color: #fff;
          min-width: 150rpx;
          height: 65rpx;
          line-height: 65rpx;
          background-color: $theme-color;
          border-radius: 40rpx;
          text-align: center;
          margin-right: 10rpx;
          padding: 0 20rpx;
        }
        .op-btn.disabled {
          background-color: #c8c9cc;
          color: #fff;
        }
        .op-btn.cancel {
          background-color: #3c9cff;
        }
        .op-btn.refuse {
          background-color: #f5329a;
        }
      }
    }
  }

  .join-apply {
    margin-bottom: 60rpx;

    .form-section {
      background: #fff;
      border-radius: 20rpx;
      margin: 20rpx;
      padding: 20rpx;

      .bottom-line {
        border-bottom: 2rpx solid #eeeeee;
      }

      .title {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #141414;
        align-items: center;
        line-height: 80rpx;
      }
    }

    .opt {
      display: flex;
      justify-content: space-between;
      width: 400rpx;
      margin: 20rpx auto;

      button {
        background-color: #18b566;
        color: #fff;
        font-size: 36rpx;
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
      }
      button.cancel {
        background-color: #dd6161;
      }

      button.disabled {
        background-color: #c8c9cc;
        color: #fff;
      }
    }
  }

  .form-block {
    .col {
      display: flex;
      justify-content: space-between;
      line-height: 80rpx;
      background: #fff;
      border-bottom: 1px solid #f5f5f5;

      .lab {
        width: 120rpx;

        &::after {
          content: ':';
        }
      }
      .form-input {
        flex: 1;
        margin-left: 20rpx;

        input {
          height: 60rpx;
          line-height: 60rpx;
          margin: 10rpx 20rpx 10rpx 0;
          font-size: 12px;
          color: #666;
          background-color: #eee;
          padding: 0 15rpx;
        }

        .group-item {
          margin-right: 30rpx;
        }
      }
    }
  }

  .slot-content {
    .confim-note {
      color: #ff9900;
      font-size: 33rpx;
      margin-bottom: 20rpx;
    }
  }
}
</style>
