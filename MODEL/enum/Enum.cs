using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using COM;

namespace MODEL
{
    public static class Enum
    {
        /// <summary>
        /// 登录方式
        /// </summary>
        public enum LoginWay
        {
            [RemarkAttribute("网页")]
            Web = 0,

            [RemarkAttribute("微信")]
            WeChat = 1
        }

        /// <summary>
        /// 消息推送
        /// </summary>
        public enum MessageWay
        {
            [RemarkAttribute("短信")]
            SMS = 0,

            [RemarkAttribute("企业微信")]
            WeCom = 1
        }

        /// <summary>
        /// 登录角色
        /// 角色对应视图，对应子系统
        /// </summary>
        public enum SystemRole
        {
            [RemarkAttribute("后台管理")]
            Admin = 0,

            [RemarkAttribute("地质灾害监测")]
            Monitor = 1,

            [RemarkAttribute("演示系统")]
            Display = 2,

            [RemarkAttribute("业主系统")]
            Owner = 3,

            [RemarkAttribute("无人机航线规划")]
            Uav = 4,

            [RemarkAttribute("消落带系统")]
            Flz = 5,

            [RemarkAttribute("3D Points Cloud系统")]
            pointsCloud = 6,

            [RemarkAttribute("无人机影像分析系统")]
            Image = 7,

            [RemarkAttribute("陡崖数据采集系统")]
            Rock = 8,

            [RemarkAttribute("无角色")]
            Null = 99
        }

        /// <summary>
        /// 状态码
        /// </summary>
        public enum State
        {
            [RemarkAttribute("无效")]
            NoUse = 0,

            [RemarkAttribute("有效")]
            InUse = 1
        }

        /// <summary>
        /// 请求响应结果编码
        /// </summary>
        public enum ResponseResultCode
        {
            [RemarkAttribute("失败")]
            Failure = 0,

            [RemarkAttribute("成功")]
            Success = 1
        }

        /// <summary>
        /// SQL类型
        /// </summary>
        public enum SqlType
        {
            [RemarkAttribute("读取")]
            Read = 0,

            [RemarkAttribute("写入")]
            Write = 1
        }

        /// <summary>
        /// 数据库类型
        /// </summary>
        public enum DbType
        {
            [RemarkAttribute("SQLServer")]
            SQLServer = 0,

            [RemarkAttribute("Oracle")]
            Oracle = 1,

            [RemarkAttribute("MySQL")]
            MySQL = 2,

            [RemarkAttribute("PostgreSQL")]
            PostgreSQL = 3,

            [RemarkAttribute("SQLite")]
            SQLite = 4
        }

        /// <summary>
        /// 面积单位
        /// </summary>
        public enum AreaUnit
        {
            [RemarkAttribute("平方米")]
            m2 = 0,

            [RemarkAttribute("平方公里")]
            km2 = 1
        }

        /// <summary>
        /// 体积单位
        /// </summary>
        public enum VolumeUnit
        {
            [RemarkAttribute("立方米")]
            m3 = 0,

            [RemarkAttribute("立方千米")]
            km3 = 1
        }

        /// <summary>
        /// 点云文件格式
        /// </summary>
        public enum PointCloudFormat
        {
            [RemarkAttribute("TXT")]
            TXT = 0,

            [RemarkAttribute("LAS")]
            LAS = 1,

            [RemarkAttribute("PNTS")]
            PNTS = 2
        }


    }
}