﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MODEL
{
    /// <summary>
    /// 监测项目（文本）
    /// </summary>
    public class MonitorProjectString
    {
        /// <summary>
        /// id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 项目名称
        /// </summary>
        public string XMMC { get; set; }
        /// <summary>
        /// 项目编码
        /// </summary>
        public string XMBM { get; set; }
        /// <summary>
        /// 中心经度
        /// </summary>
        public string ZXJD { get; set; }
        /// <summary>
        /// 中心纬度
        /// </summary>
        public string ZXWD { get; set; }
        /// <summary>
        /// SRID
        /// </summary>
        public string SRID { get; set; }
        /// <summary>
        /// 行政区编码
        /// </summary>
        public string XZQBM { get; set; }
        /// <summary>
        /// 行政区位置
        /// </summary>
        public string XMWZ { get; set; }
        /// <summary>
        /// 项目开始时间
        /// </summary>
        public string XMKSSJ { get; set; }
        /// <summary>
        /// 项目结束时间
        /// </summary>
        public string XMJSSJ { get; set; }
        /// <summary>
        /// 项目类型
        /// </summary>
        public string XMLX { get; set; }
        /// <summary>
        /// 项目类别
        /// </summary>
        public string XMLB { get; set; }
        /// <summary>
        /// 灾害类型
        /// </summary>
        public string ZHLX { get; set; }
        /// <summary>
        /// 灾害点名称
        /// </summary>
        public string ZHDMC { get; set; }
        /// <summary>
        /// 灾害点统一编号
        /// </summary>
        public string ZHDTYBH { get; set; }
        /// <summary>
        /// 灾害等级
        /// </summary>
        public string ZHDJ { get; set; }
        /// <summary>
        /// 灾害险情
        /// </summary>
        public string ZHXQ { get; set; }
        /// <summary>
        /// 监测级别
        /// </summary>
        public string JCJB { get; set; }
        /// <summary>
        /// 监测手段
        /// </summary>
        public string JCSD { get; set; }
        /// <summary>
        /// 预警级别
        /// </summary>
        public string YJJB { get; set; }
        /// <summary>
        /// 是否库区
        /// </summary>
        public string SFKQ { get; set; }
        /// <summary>
        /// 是否涉水
        /// </summary>
        public string SFSS { get; set; }
        /// <summary>
        /// 面积
        /// </summary>
        public string MJ { get; set; }
        /// <summary>
        /// 面积单位
        /// </summary>
        public string MJDW { get; set; }
        /// <summary>
        /// 体积
        /// </summary>
        public string TJ { get; set; }
        /// <summary>
        /// 体积单位
        /// </summary>
        public string TJDW { get; set; }
        /// <summary>
        /// 威胁户数
        /// </summary>
        public string WXHS { get; set; }
        /// <summary>
        /// 威胁人数
        /// </summary>
        public string WXRS { get; set; }
        /// <summary>
        /// 威胁房屋面积
        /// </summary>
        public string WXFWMJ { get; set; }
        /// <summary>
        /// 其他威胁
        /// </summary>
        public string QTWX { get; set; }
        /// <summary>
        /// 是否结束
        /// </summary>
        public string SFJS { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public string CJSJ { get; set; }
        /// <summary>
        /// 标识码
        /// </summary>
        public string BSM { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string BZ { get; set; }
    }
}
