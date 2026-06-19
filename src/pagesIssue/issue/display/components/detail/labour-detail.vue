<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-30 16:33:36
* @LastEditors: wangxc
* @LastEditTime: 2024-07-30 16:33:36
-->
<template>
  <view class="labour-detail-box">
    <view class="body">
      <view class="info-title" v-if="isuInfoView.title">
        <text :user-select="true">{{ isuInfoView.title }}</text>
      </view>
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
      <view class="info-fields">
        <view class="col" v-if="isuInfoView.contactMan">
          <view class="title">联系人</view>
          <view class="form-input">{{ isuInfoView.contactMan }}</view>
        </view>
        <view class="col" v-if="isuInfoView.phone">
          <view class="title">电话</view>
          <view class="form-input">
            <text :user-select="true">{{ isuInfoView.phone }}</text>
          </view>
          <view class="call-phone" v-if="isuInfoView.isIsuer === 0" @click="makePhone(isuInfoView.phone)">
            <text class="myicon icon-c002dianhua">拨打电话</text>
          </view>
        </view>
      </view>
      <view class="info-fields">
        <view class="col" v-if="isuInfoView.buildPark || isuInfoView.buildNo || isuInfoView.buildUnit">
          <view class="title">位置</view>
          <view class="form-input">
            <text v-if="isuInfoView.buildPark" :user-select="true">{{ isuInfoView.buildPark }}园区</text>
            <text class="field" v-if="isuInfoView.buildNo" :user-select="true">{{ isuInfoView.buildNo }}楼</text>
            <text class="field" v-if="isuInfoView.buildUnit" :user-select="true">{{ isuInfoView.buildUnit }}单元</text>
            <text class="field" v-if="isuInfoView.buildRoom" :user-select="true">{{ isuInfoView.buildRoom }}室</text>
          </view>
        </view>
        <view class="col">
          <view class="title">酬金</view>
          <view class="form-input flex">
            <template v-if="isuInfoView.isIsuer === 1">
              <view class="flex" style="width: 280rpx">
                <text class="money">{{ dyData.reward || 0 }} </text>
                <text>元/人*日(次)</text>
              </view>
              <view class="op-btn add-reward" v-if="[taskRunStatus.BEFORE, taskRunStatus.ZG_ING, taskRunStatus.ZG_PAUSE].includes(spfs.runingStatus)" @click="rewardUpdForm.show = true">
                <text class="myicon icon-zengjia2">增加酬金</text>
              </view>
            </template>
            <template v-else>
              <view class="flex" style="width: 380rpx">
                <text class="money">{{ dyData.bCalcRecReward}} </text> 
                <text>元/人*日(次)</text>
              </view>
            </template>
          </view>
        </view>
        <view class="col">
          <view class="title">用工地点</view>
          <view class="form-input">
            <text :user-select="true">{{ dyData.address }}</text>
          </view>
        </view>
        <view class="col">
          <view class="title">用工日期</view>
          <view class="form-input">{{ dyData.laborDate }}</view>
        </view>
        <view class="col">
          <view class="title">用工时间</view>
          <view class="form-input">{{ dyData.laborTimeStart || '08:00' }} ~ {{ dyData.laborTimeEnd || '17:00'}}</view>
        </view>
        <view class="col">
          <view class="title">需求人数</view>
          <view class="form-input">{{ dyData.manNum }}<text>人</text><text style="font-size: 24rpx;">(仅供参考，以实际接受报名人数为准)</text></view>
        </view>
        <view class="col">
          <view class="title">性别要求</view>
          <view class="form-input">
            <text v-if="dyData.gender === 1">男</text>
            <text v-else-if="dyData.gender === 2">女</text>
            <text v-else>不限</text>
          </view>
        </view>
        <view class="col">
          <view class="title">年龄限制</view>
          <view class="form-input">{{ dyData.minAge || 20 }} ~ {{ dyData.maxAge || 60 }}<text>岁</text></view>
        </view>
      </view>

      <view class="audit-status" v-if="[infoStatus.AUDIT_ING, infoStatus.AUDIT_COMP].includes(isuInfoView.status)">
        <view class="audit-ing" v-if="isuInfoView.status === infoStatus.AUDIT_ING && isuInfoView.auditStatus === 0">
          <view class="result">
            <text class="desc">内容正在审核中...</text>
          </view>
        </view>
        <view class="audit-refuse" v-else-if="isuInfoView.status === infoStatus.AUDIT_COMP && [isuInfoView.REFUSE, isuInfoView.API_REFUSE].includes(isuInfoView.auditStatus)">
          <view class="result">
            <text class="desc">内容审核不通过</text>
          </view>
          <view class="memo" v-if="isuInfoView.auditExplain">
            <text class="lab">不通过原因</text>
            <text class="desc">{{ isuInfoView.auditExplain || ''}}</text>
          </view>
        </view>
      </view>

      <view class="join-list" v-if="isuInfoView.status >= infoStatus.PUSH">
        <view class="join-title">
          <text v-if="spfs.runingStatus <= taskRunStatus.ZG_OK">已报名人员:</text>
          <text v-else>参与人员:</text>
        </view>
        <view class="list-item" v-if="!joinList || !joinList.length">
          <text class="tips" v-if="spfs.runingStatus === taskRunStatus.ZG_CANCEL">招工已取消</text>
          <text class="tips" v-else>暂无人员响应</text>
        </view>
        <view class="list-item" v-for="(item, idx) in joinList" :key="item.joinId" :class="{ 'join-self': item.joinerInfo.isSelf }">
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
                <view class="opt-btn tel" v-if="item.joinPhone" @click="makePhone(item.joinPhone)">
                  <text class="myicon icon-c002dianhua"></text>
                  <text>电话联系</text>
                </view>
              </view>
              <!-- 乙方操作区 -->
              <view class="auth-op" v-else>
                <template v-if="[taskRunStatus.BEFORE, taskRunStatus.ZG_ING, taskRunStatus.ZG_PAUSE].includes(spfs.runingStatus)">
                  <view class="opt-btn disabled" v-if="item.acceptTime">已接受</view>
                  <view class="opt-btn normal" v-else>待接受</view>
                </template>
                <template v-if="spfs.runingStatus === taskRunStatus.ZG_OK">
                  <view class="opt-btn disabled" v-if="!item.acceptTime">未接受</view>
                </template>
              </view>
            </view>
          </view>
          <view class="content">
            <!-- 甲方可看乙方全部信息、参与者可看到自己全部信息 -->
            <template v-if="isuInfoView.isIsuer === 1 || item.joinerInfo.isSelf">
              <text>{{ item.joinerInfo.nickName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.genderTxt }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.age }}岁</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinPhone }}</text>
            </template>
            <!-- 乙方可看他人掩码信息 -->
            <template v-else-if="isJoin">
              <text>{{ item.joinerInfo.maskName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.genderTxt }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.age }}岁</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.maskPhone }}</text>
            </template>
            <!-- 非参与人只参与乙方名称掩码、性别、年龄信息 -->
            <template v-else>
              <text>{{ item.joinerInfo.maskName }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.genderTxt }}</text>
              <text class="txt-split">/</text>
              <text>{{ item.joinerInfo.age }}岁</text>
            </template>
          </view>
          <!-- 参与状态信息 -->
          <view class="join-stat-line">
            <!-- 甲方状态提示 -->
            <template v-if="isuInfoView.isIsuer === 1">
              <template v-if="spfs.runingStatus === taskRunStatus.ZG_ING">
                <view class="stat">{{ item.acceptTime ? '报名已受理' : '招工受理中...' }}</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE">
                <view class="stat">{{ item.acceptTime ? '报名已受理' : '招工已暂停' }}</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_CANCEL">
                <view class="stat">招工已取消</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_OK">
                <view class="stat">用工开始前4小时开始签到</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_SIGN">
                 <view class="stat">
                  <template v-if="item.signTime">
                    <text v-if="!item.arriveTime">报名人已签到，等待你到岗确认</text>
                    <text v-else-if="item.isArrive === 1">报名人已签到，已被你确认到岗</text>
                  </template>
                  <template v-else>
                    <text v-if="!item.arriveTime">报名人签到中...</text>
                    <text v-else-if="item.isArrive === 1">报名人未签到，但你已确认到岗</text>
                  </template>
                </view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING">
                <view class="stat">
                  <template v-if="item.signTime">
                    <text v-if="!item.arriveTime">报名人已签到，等待你到岗确认</text>
                    <text v-else-if="item.isArrive === 1">报名人已签到，已被你确认到岗</text>
                    <text v-else-if="item.isArrive === 2">报名人已签到，但被你确认未到岗</text>
                  </template>
                  <template v-else>
                    <text v-if="!item.arriveTime">报名人未签到</text>
                    <text v-else-if="item.isArrive === 1">报名人未签到，但已被你确认到岗</text>
                    <text v-else-if="item.isArrive === 2">报名人未签到，已被你确认未到岗</text>
                  </template>
                </view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH">
                <view class="stat" v-if="!item.cfmDoneTime">用工已结束，请在{{ item.settleEndTime }}前确认帮工人的完成度...</view>
                <view class="stat" v-else-if="!item.settleTime && item.doneDegree < 100">帮工人的完成度已评估完成,完成度评值为{{ item.doneDegree }}%.</view>
                <view class="stat" v-else-if="item.isArrive === 2 && item.settleTime && item.joinStatus === 6">用工已结束，帮工人未到岗，已收到对方赔偿的误工费.</view>
                <view class="stat" v-else>用工已结束, 帮工酬金已结算</view>
              </template>
            </template>
            <!-- 乙方状态提示 -->
            <template v-else>
              <template v-if="spfs.runingStatus === taskRunStatus.ZG_ING">
                <view class="stat">{{ item.acceptTime ? '报名已受理' : '招工受理中...' }}</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE">
                <view class="stat">{{ item.acceptTime ? '报名已受理' : '招工已暂停' }}</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_CANCEL">
                <view class="stat">用工计划已取消</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_OK">
                <view class="stat" v-if="item.joinerInfo.isSelf">用工开始前4小时开始签到</view>
                <!-- 非乙方本人只能看到是否受理或招工状态 -->
                <view class="stat" v-else>{{ item.acceptTime ? '报名已受理' : '招工已暂停' }}</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_SIGN">
                <!-- 乙方签到时状态 -->
                <template v-if="item.joinerInfo.isSelf">
                  <template v-if="item.signTime">
                    <template v-if="item.arriveTime">
                      <view class="stat" v-if="item.isArrive === 1">已签到,用工人已确认到岗</view>
                    </template>
                    <view class="stat" v-else style="color: #fa3534">已签到,等待用工人到岗确认</view>
                  </template>
                  <template v-else>
                    <template v-if="item.arriveTime">
                      <view class="stat" v-if="item.isArrive === 1">用工人已确认到岗</view>
                    </template>
                    <view class="stat" v-else>签到中...</view>
                  </template>
                </template>
                <template v-else>
                  <!-- 非乙方本人只能看到是否受理或招工状态 -->
                  <view class="stat">{{ item.acceptTime ? '报名已受理' : '招工已暂停' }}</view>
                </template>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING">
                <!-- 乙方开工后状态 -->
                <template v-if="item.joinerInfo.isSelf">
                  <template v-if="item.signTime">
                    <template v-if="item.arriveTime">
                      <view class="stat" v-if="item.isArrive === 2" style="color: #fa3534">
                        <text>你已签到,但目前用工人否认你到岗</text>
                        <text>。如你确实已到岗，请及时通知用工人对你重新[到岗确认]！</text>
                        <text>用工结束前如果你还是[未到岗]状态，你不仅不会获得帮工酬金，还需承担使用参与保证金抵扣误工费的损失！</text>
                      </view>
                      <view class="stat" v-if="item.isArrive === 1">已签到,已被用工人确认到岗</view>
                    </template>
                    <view class="stat" v-else style="color: #fa3534">用工已开始,请及时提醒用工人对你到岗确认</view>
                  </template>
                  <template v-else>
                    <template v-if="item.arriveTime">
                      <view class="stat" v-if="item.isArrive === 2" style="color: #fa3534">
                        <text>你未签到，用工人已确认你未到岗</text>
                        <text>。如已到岗，请及时签到并通知用工人对你[到岗确认]！</text>
                        <text>,用工结束前如果你还是[未到岗]状态，你不仅不会获得帮工酬金，还需承担使用参与保证金抵扣误工费的损失！</text>
                      </view>
                      <view class="stat" v-if="item.isArrive === 1">未签到，但已被用工人确认到岗</view>
                    </template>
                    <view v-else class="stat" style="color: #fa3534">用工已开始，你还未签到</view>
                  </template>
                </template>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH">
                <!-- 乙方任务结束后状态 -->
                <view class="stat" v-if="!item.cfmDoneTime">
                  <text>帮工任务已结束，请在</text>
                  <text style="color: #ff9900">{{ item.settleEndTime }}</text>
                  <text>前提醒用工人确认你的完成度</text>
                </view>
                <view class="stat" v-else-if="!item.settleTime && item.doneDegree < 100">
                  <text>用工人确认你的</text>
                  <text style="color: #fa3534">完成度不足({{ item.doneDegree }}%)</text>
                  <text>,理由为:{{ item.diffDoneReason }}</text>
                  <text>, 如对此评估有异议，请在</text>
                  <text style="color: #ff9900">{{ item.settleEndTime }}</text>
                  <text>前与用工人协商进行更改，否则平台将按此完成度进行折算后发放最终酬金。</text>
                </view>
                <view class="stat" v-else-if="item.isArrive === 2 && item.settleTime && item.joinStatus === 6">
                  <text>帮工任务已结束，用工人确认你</text>
                  <text style="color: #fa3534">[未到岗]</text>
                  <text>, 平台已按照你失约将报名时的参与保证金抵扣误工费赔偿给用工人，</text>
                  <text style="color: #ff9900">如你对此结果有异议，请自行私下与用工人协商解决。</text>
                </view>
                <view class="stat" v-else-if="item.isArrive === 1 && item.settleTime && item.settleReward">
                  <text>你本次的帮工任务已结算，最后结算酬金为</text>
                  <text style="color: #fa3534">{{ item.settleReward }}元</text>
                  <text>,欢迎继续参与其他邻居的求助任务</text>
                </view>
                <view class="stat" v-else></view>
              </template>
            </template>
          </view>
          <!-- 参与操作行 -->
          <view class="join-opt-line">
            <!-- 甲方操作 -->
            <template v-if="isuInfoView.isIsuer === 1">
              <template v-if="spfs.runingStatus === taskRunStatus.ZG_ING">
                <view class="opt-btn cancel" v-if="item.acceptTime" @click="aAcptBJoin(item.joinId, 2)">取消接受</view>
                <view class="opt-btn" v-else @click="aAcptBJoin(item.joinId, 1)">接受报名</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE">
                <view class="opt-btn cancel" v-if="item.acceptTime" @click="aAcptBJoin(item.joinId, 2)">取消接受</view>
                <view class="opt-btn" v-else @click="aAcptBJoin(item.joinId, 1)">接受报名</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_OK">
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_SIGN">
                <view class="opt-btn cancel" style="width: 180rpx" v-if="!item.isArrive || item.isArrive === 0" @click="aConfirmBSign(item.joinId, true)">确认已到岗</view>
                <view class="opt-btn disabled" style="width: 180rpx" v-if="item.isArrive === 1">已确认到岗</view>
              </template>
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING">
                <!-- 开工后方可确认帮工人未到岗 -->
                <template v-if="!item.arriveTime || !item.isArrive || item.isArrive === 0">
                  <!-- 还未确认的可以确认到岗或未到岗，已确认未到岗的可以改为到岗-->
                  <view class="opt-btn cancel" style="width: 180rpx" @click="aConfirmBSign(item.joinId, true)">确认已到岗</view>
                  <view class="opt-btn cancel" style="width: 180rpx" @click="aConfirmBSign(item.joinId, false)">确认未到岗</view>
                </template>
                <template v-else>
                  <view class="opt-btn cancel" style="width: 180rpx" v-if="item.isArrive === 0" @click="aConfirmBSign(item.joinId, true)">确认已到岗</view>
                  <view class="opt-btn disabled" style="width: 180rpx" v-else-if="item.isArrive === 1">已确认到岗</view>
                  <view class="opt-btn cancel" style="width: 180rpx" v-else-if="item.isArrive === 2" @click="aConfirmBSign(item.joinId, true)">更改为到岗</view>
                </template>
              </template>
              <!-- 任务完成 -->
              <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH">
                <!-- 未结算乙方-->
                <template v-if="!item.settleTime || item.joinStatus === 5">
                  <!-- 未确认完成度或完成度不足-->
                  <view class="degree" v-if="!item.cfmDoneTime || item.doneDegree < 100">
                    <form @submit="degreeSubmit(idx, $event)">
                      <view class="slide">
                        <view class="lab">完成度:</view>
                        <slider
                          v-if="!item.cfmDoneTime"
                          name="doneDegree"
                          value="100"
                          min="10"
                          max="100"
                          step="10"
                          block-size="20"
                          @change="doneDegreeChange(idx, $event)"
                          show-value />
                        <slider
                          v-else-if="item.doneDegree < 100"
                          name="doneDegree"
                          :value="item.doneDegree"
                          :min="item.doneDegree"
                          max="100"
                          step="10"
                          block-size="20"
                          @change="doneDegreeChange(idx, $event)"
                          show-value />
                      </view>
                      <view class="reason" v-if="!item.scoreDegree || item.scoreDegree < 100">
                        <view class="lab">完成度不足原因:</view>
                        <view class="check">
                          <checkbox-group name="diffDoneReason">
                            <label><checkbox value="到岗迟到" :checked="item.diffDoneReason && item.diffDoneReason.includes('到岗迟到')" />到岗迟到</label>
                            <label><checkbox value="提前退出" :checked="item.diffDoneReason && item.diffDoneReason.includes('提前退出')" />提前退出</label>
                          </checkbox-group>
                        </view>
                      </view>
                      <view class="dgee-cfm">
                        <button class="opt-btn" style="width: 200rpx" form-type="submit">确认完成度</button>
                      </view>
                    </form>
                  </view>
                </template>
              </template>
            </template>
            <!-- 乙方操作 -->
            <template v-else-if="isJoin"> 
            </template>
            <!-- 访客操作 -->
            <template v-else></template>
          </view>
        </view>
      </view>

      <view class="footer">
        <!-- 甲方操作区 -->
        <view class="op" v-if="isuInfoView.isIsuer === 1">
          <template v-if="spfs.runingStatus === taskRunStatus.ZG_ING">
            <template v-if="diffStart > 0">
              <view class="op-btn" @click="editIsuThis(0, 'edit', 'modify')">编辑</view>
              <view class="op-btn" @click="chgHireStatus(taskRunStatus.ZG_PAUSE)">暂停招工</view>
              <view v-if="!acptJoinList.length || acptJoinList.length === 0" class="op-btn disabled">完成招工</view>
              <view v-else class="op-btn" @click="chgHireStatus(taskRunStatus.ZG_OK)">完成招工</view>
              <view class="op-btn" @click="aTaskPull(false)">取消招工</view>
            </template>
            <template v-else>
              <view class="op-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
              <view class="op-btn" @click="aTaskPull(false)">取消任务</view>
              <view class="op-btn disabled">时间已过期</view>
            </template>
          </template>
          <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE">
            <view class="op-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
            <template v-if="diffStart > 0">
              <view class="op-btn" @click="chgHireStatus(taskRunStatus.ZG_ING)">继续招工</view>
              <view class="op-btn" :class="{ disabled: !acptJoinList.length || acptJoinList.length === 0 }" @click="chgHireStatus(taskRunStatus.ZG_OK)">完成招工</view>
              <view class="op-btn" @click="aTaskPull(false)">取消招工</view>
            </template>
            <template v-else>
              <view class="op-btn" @click="aTaskPull(false)">取消任务</view>
              <view class="op-btn disabled">时间已过期</view>
            </template>
          </template>
          <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_OK">
            <view class="stat-txt">招工完成，正在等待开工...</view>
            <view class="op-btn" @click="aTaskPull(false)">取消任务</view>
          </template>
          <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_SIGN">
            <view class="stat-txt">招工完成，正在签到中...</view>
            <view class="op-btn" @click="aTaskPull(false)">取消任务</view>
          </template>
          <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING">
            <view class="stat-txt" v-if="diffStart > 1000 * 60 * 30 * -1">用工任务进行中，用工过程至少30分钟后才能结束</view>
            <template v-else>
              <view class="stat-txt">用工任务进行中...</view>
              <view class="op-btn" @click="aCfmTaskFinish()">用工结束</view>
            </template>
          </template>
          <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH">
            <template v-if="isuInfoView.status === infoStatus.FINISH && spfs.settleDoneFlag < 2">
              <view class="stat-txt">用工结束，正在结算帮工人酬金...</view>
            </template>
            <template v-else-if="isuInfoView.status === infoStatus.SETTLE_DONE && spfs.settleDoneFlag === 2">
              <view class="stat-txt">当前用工已完结</view>
              <view class="op-btn" @click="againIsuThis()">继续招工</view>
            </template>
          </template>
          <template v-if="isuInfoView.status === infoStatus.PULL">
            <view class="op-btn" @click="editIsuThis(1, 'edit', 'rPush')">重新上架</view>
          </template>
          <template v-else-if="isuInfoView.status === infoStatus.AUDIT_COMP">
            <view class="op-btn" v-if="[isuInfoView.REFUSE, isuInfoView.API_REFUSE].includes(isuInfoView.auditStatus)" @click="editIsuThis(1, 'edit', 'fPush')">编辑</view>
          </template>
        </view>

        <!-- 非甲方操作区 -->
        <view class="op" v-else>
          <!-- 已受理乙方 -->
          <template v-if="isJoin">
            <template v-if="spfs.runingStatus === taskRunStatus.ZG_ING || spfs.runingStatus === taskRunStatus.ZG_PAUSE">
              <view class="op-btn disabled">已报名</view>
              <view class="op-btn" @click="cancelApply">取消报名</view>
            </template>
            <template v-else-if="spfs.runingStatus === taskRunStatus.ZG_OK">
              <view class="stat-txt">招工已完成，等待到岗签到...</view>
            </template>
            <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_SIGN">
              <view class="stat-txt">到岗签到中...</view>
              <template v-if="myJoin.acceptTime && !myJoin.signTime">
                <view class="op-btn" @click="bArriveSign(myJoin.joinId)">到岗签到</view>
              </template>
            </template> 
            <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING">
              <!-- 任务结束前参与人都可签到 -->
              <view class="stat-txt">帮工任务进行中...</view>
              <template v-if="myJoin.acceptTime && !myJoin.signTime">
                <view class="op-btn" @click="bArriveSign(myJoin.joinId)">到岗签到</view>
              </template>
            </template>
            <template v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH">
              <template v-if="isuInfoView.status === infoStatus.FINISH && spfs.settleDoneFlag < 2">
                <view class="stat-txt">用工结束，正在结算酬金...</view>
                <view class="op-btn disabled" v-if="myJoin.joinStatus === 5">结算中</view>
                <view class="op-btn disabled" v-else-if="myJoin.joinStatus === 6">已结清</view>
              </template>
              <template v-else-if="isuInfoView.status === infoStatus.SETTLE_DONE && spfs.settleDoneFlag === 2">
                <view class="stat-txt">用工已结束</view>
                <view class="op-btn disabled">已完结</view>
              </template>
            </template>
          </template>
          <!-- 非参与方 -->
          <template v-else>
            <view class="op-btn disabled" v-if="isuInfoView.status === 8 && spfs.settleDoneFlag === 2">已完结</view>
            <view class="op-btn disabled" v-else-if="diffStart < 0">招工已过期</view>
            <view class="op-btn" v-else-if="spfs.runingStatus === taskRunStatus.ZG_ING" @click="showJoinApply">抢先报名</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE">招工已暂停</view>
            <view class="op-btn disabled" v-else-if="spfs.runingStatus >= taskRunStatus.ZG_OK">已招满了</view>
          </template>
        </view>
      </view>
    </view>

    <u-popup :show="rewardUpdForm.show" :round="10" mode="bottom" overlayStyle="{background: 'rgba(3, 100, 219, 0.5)'}" @close="rewardUpdForm.show = false">
      <view class="join-apply">
        <form @submit="addReward">
          <view class="form-section form-block">
            <view class="bottom-line title">输入新的酬金额度</view>
            <view class="col">
              <view class="lab">当前酬金</view>
              <view class="form-input">
                <input type="number" name="reward" :value="dyData.reward" :disabled="true" placeholder="当前赏金额度" />
              </view>
              <view style="width: 300rpx">元</view>
            </view>
            <view class="col">
              <view class="lab">新的酬金</view>
              <view class="form-input">
                <input type="number" name="newReward" :value="dyData.reward" placeholder="新的酬金额度" />
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

    <u-popup :show="commForm.show" :round="10" mode="bottom" overlayStyle="{background: 'rgba(3, 100, 219, 0.5)'}" @close="joinPopClose">
      <view class="join-apply">
        <form @submit="joinSubmit">
          <view class="form-section">
            <view class="bottom-line title">你的报名信息</view>
            <view class="col">
              <view class="lab">称呼</view>
              <view class="form-input">
                <input type="text" name="nickName" :value="joinForm.nickName" placeholder="你的称呼" />
              </view>
            </view>
            <view class="col">
              <view class="lab">性别</view>
              <view class="form-input">
                <radio-group name="gender">
                  <label class="group-item"> <radio value="1" :checked="joinForm.gender === '1'" /><text>男</text> </label>
                  <label class="group-item"> <radio value="2" :checked="joinForm.gender === '2'" /><text>女</text> </label>
                </radio-group>
              </view>
            </view>
            <view class="col">
              <view class="lab">年龄</view>
              <view class="form-input">
                <input type="number" name="age" :value="joinForm.age" placeholder="你的年龄" />
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
            <button class="submit" :class="{ disabled: canJoin === false }" :disabled="!canJoin" form-type="submit">确定</button>
            <button class="cancel" type="default" @click="commForm.show = false">取消</button>
          </view>
        </form>
      </view>
    </u-popup>

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
        <view v-if="confirmModel.showNote" style="color: #ff9900; font-size:36rpx; margin-bottom:15rpx;">{{ confirmModel.showNote }}</view>
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
import { isNotEmpty } from '@/utils/validate'

import payment from '@/common/components/Payment'
import formPay from '@/common/js/form/form-pay.js'
import consdef from '@/common/js/constant/consdef.js'
import appstate from '@/libs/appstate'

import {
  zlsbsUpdSpecl,
  zlsbsUpdReward,
  zlsbsJoinApply,
  zlsbsPreJoinApply,
  zlsbsCancelApply,
  zlsbsJoinStat,
  zlsbsAAcptJoin,
  zlsbsAAcptOk,
  zlsbsAPreAcptOk,
  zlsbsATaskPull,
  zlsbsBArvSignIn,
  zlsbsACfrmBSignIn,
  zlsbsATaskFinish,
  zlsbsAScoreBDone
} from '@/api/isuJoin'
import surety from '@/api/surety'
import { getUserInfos, getUserAccount } from '@/api/user'

export default {
  name: 'labour-detail',
  components: {
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
      diffStart: -1, // 距开工时间，毫秒数
      diffStartInterval: null, // 间隔计算距开工时间
      diffEnd: -1, // 距帮工结束时间

      // 信息附件图片
      imgUrls: [],

      // 评论表单对象
      commForm: {
        show: false,
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
        gender: 1,
        age: 30,
        phone: ''
      },

      canJoin: true, // 是否可参与
      joinList: [],
      joinUsers: {}, //
      acptJoinList: [], // 已受理的参与人
      isJoin: false, // 当前用户是否已参与
      myJoin: {}, // 当前用户的参与记录
      joinTipTxt:
        '1)．关于保证金规则：为保证用/帮工双方利益不受损害，平台实行保证金规则。在你报名前，请务必首先确认你是否能接受预交保证金，并能按时到岗完成帮工任务，否则请不要报名参与;\n\n ' +
	      '2)．关于保证金管理与安全：保证金由平台统一管理，请放心支付。保证金额度为酬金的20%(最低2元)，如果用工方在【完成招工】时未接受你的报名申请，保证金会第一时间全额原路退回你的账户。保证金也不会影响到你的帮工任务酬金，在用工方确认【用工完成】后，保证金也会在第一时间全额原路退回你的账户;\n\n' + 
        '3)．如果你的报名申请被接受，在用工方【完成招工】后，而【用工完成】前你未被确认到岗,你预支付的保证金将会作为误工费赔偿给用工方;\n\n ' +
        '4)．误工赔偿是相互的，如果用工方【完成招工】后却临时【取消用工】，也会按约定赔偿规则支付你相应额度的误工费; \n\n ' +
        '5)．用工方误工费赔偿支付计算规则：用工方【取消用工】在用工前超过8小时免赔偿；小于8小时但超过4小时为酬金的10%；小于4小时为酬金的20% 。',

      acptOkTxt:
        '1)．【完成招工】需要你立即预支付用工酬金，在【用工完成】前，用工酬金由平台托管;\n\n ' +
        '2)．如果用工任务开始前你临时【取消用工】(任务开始时间以信息发布时填写的用工开始时间为准)，系统将从你的预支付酬金中扣除部分金额作为误工费赔偿支付给已受理的报名人，剩余部分才会原路退还回你的账户;\n\n ' +
        '3)．误工费赔偿支付计算规则：【取消用工】在用工前超过8小时免赔偿；小于8小时但超过4小时为酬金的10%；小于4小时为酬金的20% 。',

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

      infoStatus: {
        ...consdef.issue.infoStatus
      },

      auditStatus: {
        ...consdef.issue.auditStatus
      },

      taskRunStatus: {
        ...consdef.issue.labourTaskRunStatus
      },

      ...$d3
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
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
    if (_that.diffStartInterval) {
      clearInterval(_that.diffStartInterval)
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

        /*getIsuCateById(_that.infoData.cateId).then((r) => {
          _that.infoCate = r
        }) */

        _that.loadInfoData(imgUrls, dyFormData, speclFields)

        if (userLiveInfo) {
          const { userInfo, commLive } = { ...userLiveInfo }
          _that.isuUserInfo = userInfo
          _that.commLive = commLive
          if (_that.isuUserInfo) {
            const avatarUrl = this.isuUserInfo.avatarUrl
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

      // 专有内容
      if (isNotEmpty(speclFields)) {
        // _that.spfs = JSON.parse(speclFields)
        _that.spfs = speclFields
      }

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
        _that.dyData = dyFormData

        if (_that.dyData.laborDate && _that.dyData.laborTimeStart) {
          const timeStart = _that.dyData.laborDate + ' ' + _that.dyData.laborTimeStart + ':00'
          _that.dyData.timeStart = timeStart
          const timeEnd = _that.dyData.laborDate + ' ' + _that.dyData.laborTimeEnd + ':00'
          _that.dyData.timeEnd = timeEnd

          if (!_that.diffStartInterval) {
            _that.diffStartInterval = setInterval(
              (function () {
                const fn = function () {
                  let diffStart = 0 - _that.$util.timeAgoMillion(_that.dyData.timeStart)
                  if (diffStart < 0) {
                    // 已开工
                  }
                  _that.diffStart = diffStart

                  const diffEnd = 0 - _that.$util.timeAgoMillion(_that.dyData.timeEnd)
                  _that.diffEnd = diffEnd
                }
                fn()
                return fn
              })(),
              1000 * 60
            )
          }
        }
      }
    },

    intervalJoinList() {
      const _that = this
      if (_that.joinListInterval) {
        clearInterval(_that.joinListInterval)
      }
      // 设置间隔为3分钟
      _that.joinListInterval = setInterval(
        (function () {
          const fn = function () {
            if (_that.spfs.runingStatus === _that.taskRunStatus.ZG_ING || _that.spfs.runingStatus === _that.taskRunStatus.ZG_PAUSE) {
              _that.getJoinStat(0)
            } else if (_that.isuInfoView.isIsuer === 1) {
              // 受理完成后，甲方可看所有已受理用户
              _that.getJoinStat(1)
            } else if (_that.isuInfoView.isIsuer !== 1) {
              // 受理完成后，受理人本人只能看到自己的报名记录
              // _that.getJoinStat(2)

              // 受理完成后，参与人自己排在最前，利于操作
              _that.getJoinStat(3)
            }
          }
          fn()
          return fn
        })(),
        1000 * 60 * 3
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
     * bizType: 业务类型
     * cfmData: 确认时传递的数据
     */
    confirmOk(bizType, cfmData) {
      this.confirmCancel()
      if (bizType === 1) {
        if (cfmData.hasAcpt) {
          this.aAcptOk()
        } else {
          // 无受理人直接取消：有参与人需解除参与者在途
          this.aTaskPull(!cfmData.hasJoin)
        }
      } else if (bizType === 2) {
        this.aTaskPull(true)
      } else if (bizType === 3) {
        // 乙方报名申请确认
        this.toApplyJoin()
      } else if (bizType === 4) {
        // 帮工任务确认完成
        this.aTaskFinish()
      } else if (bizType === 6) {
        // 完成度确认
        this.aCfirmBDegree(cfmData)
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
        isuCateId: this.infoData.cateId,
        joinListType: listType
      }

      zlsbsJoinStat(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          
          const { dyFormData, speclFields, imgUrls, ...infoData } = { ..._res.isuInfo }
          _that.infoData = infoData
          const joinList = _res.joinList

          _that.loadInfoData(imgUrls, dyFormData, speclFields)

          _that.joinList = []
          _that.acptJoinList = []
          let joinUids = []
          _that.myJoin = {}
          _that.isJoin = false

          joinList.forEach((el) => {
            if (el.joinTxt) {
              el.joinerInfo = JSON.parse(el.joinTxt)
              el.joinerInfo.genderTxt = el.joinerInfo.gender === '1' ? '男' : '女'
              if (isNotEmpty(el.joinerInfo.nickName)) {
                el.joinerInfo.maskName = el.joinerInfo.nickName.substr(0, 1) + '**'
              }
            }

            if (isNotEmpty(el.joinPhone)) {
              el.joinerInfo.maskPhone = el.joinPhone.substr(0,2) + '***' + el.joinPhone.substr(el.joinPhone.length - 1)
            }

            el.scoreDegree = el.doneDegree
            _that.joinList.push(el)

            const juid = Number(el.joinUid)
            if (!joinUids.includes(juid)) {
              joinUids.push(juid)
            }
            
            if (juid === _that.uid) {
              el.joinerInfo.isSelf = true // 参与者自己
              _that.myJoin = { ...el }
              _that.isJoin = true
              _that.canJoin = false
            } else {
              el.joinerInfo.isSelf = false // 其他参与者
            }

            if (el.acceptTime) {
              _that.acptJoinList.push(el)
            }
          })

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
    chgHireStatus(v) {
      const _that = this
      if (v !== _that.taskRunStatus.ZG_ING && v !== _that.taskRunStatus.ZG_PAUSE && v !== _that.taskRunStatus.ZG_OK) {
        return false
      }
      if (v === _that.taskRunStatus.ZG_OK) {
        setTimeout(function () {
          if (_that.acptJoinList.length > 0) {
            _that.confirmModel = {
              bizType: 1, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划
              show: true,
              showNote: '注意:', // 是否显示注意提示
              title: '',
              fontSize: '28rpx',
              cfmData: {
                hasJoin: _that.joinList.length > 0,
                hasAcpt: _that.acptJoinList.length > 0
              },
              content: _that.acptOkTxt
            }
          } else {
            _that.confirmModel = {
              bizType: 1, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划
              show: true,
              showNote: '注意:', // 是否显示注意提示
              title: '',
              fontSize: '28rpx',
              cfmData: {
                hasJoin: _that.joinList.length > 0,
                hasAcpt: _that.acptJoinList.length > 0
              },
              content: '没有接受任何人的参与，本次操作按[用工取消]对待，是否继续?'
            }
          }
        }, 500)

        return false
      }

      const specl = {
        runingStatus: v
      }

      const reqVo = {
        isuId: this.infoData.isuId,
        comId: this.infoData.comId,
        isuCateId: this.infoData.cateId,
        specl: JSON.stringify(specl) 
      }
      zlsbsUpdSpecl(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // _that.$emit('reload')
          _that.intervalJoinList()
          // 专有内容
          /* if (_res.speclFields) {
            _that.spfs = JSON.parse(_res.speclFields)
          }*/
        }
      })
    },

    /**
     * 抢先报名
     */
    showJoinApply() {
      const _that = this
      const chkRes = appstate.checkLogin()
      if (!chkRes) {
        // 仅登录用户可以操作
        appstate.toLogin()
        return false
      }

      this.canJoin = true

      setTimeout(function () {
        _that.confirmModel = {
          bizType: 3, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划, 3:乙方报名
          show: true,
          showNote: '报名须知：', // 是否显示注意提示
          title: '',
          fontSize: '28rpx',
          content: _that.joinTipTxt
        }
      }, 500)
    },

    /**
     * 检查账户并弹出参与申请提交表单
     */
    toApplyJoin() {
      const _that = this
      _that.commForm.show = true
      // 检查账户可用额
     /* getUserAccount().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            const canUseRealAmount = _res.canUseRealAmount
            const bcalcRecReward = Number(_that.dyData.bcalcRecReward)

            let forfeit = (bcalcRecReward * 0.2).toFixed(2) // 保证金
            forfeit = forfeit < 2 ? 2 : forfeit
            if (canUseRealAmount < forfeit) {
              setTimeout(function () {
                _that.alertModel = {
                  show: true,
                  title: '',
                  content: `账户可用余额不足，需至少${forfeit}元的到岗保证金`,
                  closeOnClickOverlay: true
                }
              }, 500)
            } else {
              _that.commForm.show = true
            }
          }
        }
      }) */
    },

    joinPopClose() {
      const _that = this
      _that.commForm.show = false
    },

    /**
     * 参与响应提交
     */
    joinSubmit(e) {
      const formData = e.detail.value
      this.canJoin = false // 防止重复参与
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
        joinPhone: formData.phone,
        joinTxt: JSON.stringify({
          nickName: formData.nickName,
          gender: formData.gender,
          age: formData.age
        })
      }

      uni.showLoading({
          mask: true
      })

      zlsbsPreJoinApply(reqVo).then((res) => {
        if (res.code === 0) {
          _that.commForm.show = false
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
            /*
            _that.commForm.show = false
            _that.$uniUtil.tips({ title: '申请成功' })
            _that.intervalJoinList()
            */
          }
        }
      })
    },

    applyJoin1(v) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        comId: this.infoData.comId,
        isuCateId: this.infoData.cateId,
        joinTxt: v
      }
      zlsbsJoinApply(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            _that.commForm.show = false
            _that.$uniUtil.tips({ title: '申请成功' })
            _that.intervalJoinList()
          }
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
          // 甲方完成招工预支付酬金
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
                  uni.hideLoading()
              },
              complete: function (e) {
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
                    uni.hideLoading()
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

    },

    /**
     *乙方取消参与申请
     */
    cancelApply() {
      const _that = this
      const reqVo = {
        joinId: _that.myJoin.joinId,
        isuId: _that.infoData.isuId,
        comId: _that.infoData.comId
      }
      zlsbsCancelApply(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            _that.commForm.show = false
            _that.$uniUtil.tips({ title: '取消申请成功' })
            _that.intervalJoinList()
          }
        }
      })
    },

    /**
     * 增加酬金
     */
    addReward(e) {
      const _that = this
      const rwData = e.detail.value
      if (rwData.newReward < rwData.reward) {
        _that.$uniUtil.tips({ title: '不支持下调酬金' })
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

        zlsbsUpdReward(reqVo).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.rewardUpdForm.show = false
              _that.$uniUtil.tips({ title: '酬金调整成功' })
              _that.intervalJoinList()
            } else {
              _that.$uniUtil.tips({ title: '酬金调整失败' })
            }
          }
        })
      }
    },

    aAcptBJoin(joinId, acpType) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        joinId: joinId,
        acptType: acpType
      }
      zlsbsAAcptJoin(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            if (acpType === 1) {
              _that.$uniUtil.tips({ title: '已同意' })
            } else if (acpType === 2) {
              _that.$uniUtil.tips({ title: '已取消' })
            }

            _that.intervalJoinList()
          }
        }
      })
    },

    aAcptOk() {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId
      }
      /* 
       zlsbsAAcptOk(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          if (_res) {
            // _that.acptOkModel.show = false
            // _that.getJoinList()
            // _that.$emit('reload')
            _that.intervalJoinList()
          }
        }
      })
        */
      uni.showLoading({
          mask: true
      })

      zlsbsAPreAcptOk(reqVo).then((res) => {
        if (res.code === 0) {
          _that.commForm.show = false
          uni.hideLoading()

          const _payData = res.data
          // 专有内容
          if (_payData) {
            const payAttach = {
              editType: 'aAcceptOk' // 标记为甲方完成招工时的酬金支付
            }
            if (_payData.orderPayAmount > 0) {
              // 需要支付时，拉起支付方式选择框
              _that.goPay(_payData.orderId, _payData.orderPayAmount, _payData.feeAmount, payAttach)
            } 
            /*
            _that.commForm.show = false
            _that.$uniUtil.tips({ title: '申请成功' })
            _that.intervalJoinList()
            */
          }
        }
      })
    },

    /**
     * 甲方取消任务计划
     */
    aTaskPull(isfirm) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        isConfirm: isfirm === true ? true : false
      }
      zlsbsATaskPull(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          const cancelType = _res.columns.cancelType
          if (cancelType === 7) {
            setTimeout(function () {
              _that.alertModel = {
                show: true,
                title: '',
                content: _res.columns.msg,
                closeOnClickOverlay: true
              }
            }, 500)
          } else if ([0, 1, 2, 3, 4].includes(cancelType)) {
            setTimeout(function () {
              _that.confirmModel = {
                bizType: 2, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划
                show: true,
                showNote: cancelType == 0 ? undefined : '注意:', // 是否显示注意提示
                title: '',
                content: _res.columns.msg
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

    /**
     * 乙方到岗签到
     */
    bArriveSign(joinId) {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        joinId: joinId
      }

      zlsbsBArvSignIn(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            setTimeout(function () {
              _that.alertModel = {
                show: true,
                title: '',
                content: '你已签到成功，请及时提醒用工人对你进行到岗确认!\n如果[用工结束]时你未被确认到岗，你将不仅要承担得不到酬金的损失，还需使用参与保证金抵扣误工费赔付给用工人!!!',
                closeOnClickOverlay: true
              }
              _that.intervalJoinList()
            }, 500)
          }
        } else {
          _that.$uniUtil.tips({ title: res.msg })
        }
      })
    },

    /**
     * 甲方确认乙方是否到岗
     */
    aConfirmBSign(joinId, isfirm) {
      const _that = this
      const reqVo = {
        joinId: joinId,
        isuId: _that.infoData.isuId,
        isConfirm: isfirm === true ? true : false
      }
      zlsbsACfrmBSignIn(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            setTimeout(function () {
              if (!reqVo.isConfirm) {
                _that.alertModel = {
                  show: true,
                  title: '',
                  content: '在用工结束前，你仍可以更改该参与人为["已到岗"]状态',
                  closeOnClickOverlay: true
                }
              }
              _that.intervalJoinList()
            }, 500)
          }
        }
      })
    },

    /**
     * 任务完成前确认提示
     */
    aCfmTaskFinish() {
      const _that = this
      setTimeout(function () {
        _that.confirmModel = {
          bizType: 4, // 0:不显示, 1:甲方完成申请受理, 2:甲方取消任务计划, 4:甲方确认任务完成
          show: true,
          showNote: '特别提醒:', // 是否显示注意提示
          title: '',
          content: '用工结束后，未被进行到岗确认的已受理报名人都将按[已到岗]处理,你确认要继续执行"用工结束"操作吗？'
        }
      }, 500)
    },

    /**
     * 任务完成操作
     */
    aTaskFinish() {
      const _that = this
      const reqVo = {
        isuId: this.infoData.isuId,
        isConfirm: true
      }
      zlsbsATaskFinish(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            setTimeout(function () {
              if (!reqVo.isConfirm) {
                _that.alertModel = {
                  show: true,
                  title: '',
                  content: '用工已结束，请你在2小时内尽早对每位帮工人的任务完成度进行评价确认, 否则系统默认按100%完成度处理并结算酬金。',
                  closeOnClickOverlay: true
                }
              }
              _that.intervalJoinList()
            }, 500)
          }
        }
      })
    },

    /**
     * 完成度更改
     */
    doneDegreeChange(idx, e) {
      this.joinList[idx].scoreDegree = e.detail.value
    },

    degreeSubmit(idx, e) {
      const _that = this
      const formData = e.detail.value
      if (formData.doneDegree < 100 && formData.diffDoneReason.length === 0) {
        _that.$uniUtil.tips({ title: '必须提供完成度不足的原因', endtime: 3000 })
        return false
      }

      const reqVo = {
        joinId: _that.joinList[idx].joinId,
        isuId: _that.infoData.isuId,
        doneDegree: formData.doneDegree,
        diffDoneReason: JSON.stringify(formData.diffDoneReason)
      }

      setTimeout(function () {
        if (formData.doneDegree < 100) {
          _that.confirmModel = {
            bizType: 6, // 6: 完成度确认
            show: true,
            showNote: '特别提醒:', // 是否显示注意提示
            title: '',
            content: `本次确认帮工人[完成度不足],如果在${_that.joinList[idx].settleEndTime}前帮工人未提出异议，系统会自动按完成度比例计算并支付酬金给对方。`,
            cfmData: reqVo
          }
        } else {
          _that.confirmModel = {
            bizType: 6, // 6: 完成度确认
            show: true,
            showNote: '特别提醒:', // 是否显示注意提示
            title: '',
            content: '本次确认帮工人完成度为100%，确认提交后，系统将立即以信息原定酬金额度支付给参与人,酬金支付成功后不可撤回，你确认要继续操作吗？',
            cfmData: reqVo
          }
        }
      }, 500)
    },

    aCfirmBDegree(reqData) {
      zlsbsAScoreBDone(reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.$uniUtil.tips({ title: '完成度确认成功' })
          _that.intervalJoinList()
        } else {
          _that.$uniUtil.tips({ title: res.msg })
        }
      })
    },

    editIsuThis(flag, editType, subEditType) {
      const _that = this
      if (flag === 0) {
        _that.$uniUtil.tips({ title: '重新编辑前请先暂停招工', endtime: 3000 })
        return false
      }

      this.$Router.push({
        path: _that.infoCate.isuPagePath,
        query: {
          sCateId: _that.infoData.cateId,
          editType: 'edit',
          orgIsuId: _that.infoData.isuId
        }
      })

      this.$Router.push({
        path: _that.infoCate.isuPagePath,
        query: {
          sCateId: _that.infoData.cateId,
          editType: editType,
          subEditType: subEditType,
          orgIsuId: _that.infoData.isuId
        }
      })
    },

    /**
     * 继续发布
     */
    againIsuThis() {
      const _that = this
      this.$Router.push({
        path: _that.infoCate.isuPagePath,
        query: {
          sCateId: _that.infoData.cateId,
          editType: 'again',
          orgIsuId: _that.infoData.isuId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.labour-detail-box {
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
        justify-content: space-between;
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
          height: 56rpx;
          line-height: 56rpx;
          background-color: #e83323;
          font-size: 28rpx;
          text-align: center;
          color: #fff;
          border-radius: 5%;
          padding: auto 10rpx;
          margin: auto 20rpx;
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
        padding: 20rpx 0;
        margin-bottom: 20rpx;

        .tips {
          margin: 10rpx 20rpx;
        }

        .content {
          margin: 10rpx 0rpx;
          min-height: 60rpx;
        }

        .join-stat-line {
          padding: 0 15rpx;
          font-size: 28rpx;
          color: #2b85e4;
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

      .join-self {
        background: #fbe9ed;
        .content {
          background: #fbe9ed;
        }
      }
    }

    .footer {
      width: 100%;
      height: 100rpx;
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

      .col {
        display: flex;
        justify-content: space-between;
        line-height: 80rpx;
        background: #fff;
        border-bottom: 1px solid #f5f5f5;

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

      button.disabled {
        background-color: #c8c9cc;
        color: #fff;
      }

      button.cancel {
        background-color: #dd6161;
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
