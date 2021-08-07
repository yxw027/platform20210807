﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MODEL
{
    /// <summary>
    /// 自动化监测设备
    /// </summary>
    public class Device
    {
        /// <summary>
        /// id
        /// </summary>
        public int Id { get; set; }
        /// 唯一编码
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 设备名称
        /// </summary>
        public string SBMC { get; set; }
        /// <summary>
        /// 设备编号
        /// </summary>
        public string SBBH { get; set; }
        /// <summary>
        /// 设备型号
        /// </summary>
        public string SBXH { get; set; }
        /// <summary>
        /// 设备类型
        /// </summary>
        public int SBLX { get; set; }
        /// <summary>
        /// 供电方式
        /// </summary>
        public int? GDFS { get; set; }
        /// <summary>
        /// 厂家ID
        /// </summary>
        public int? CJID { get; set; }
        /// <summary>
        /// 经销商ID
        /// </summary>
        public int? JXSID { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public string CJSJ { get; set; }
        /// <summary>
        /// 标识码
        /// </summary>
        public string BSM { get; set; }
        ///// <summary>
        ///// 状态码
        ///// </summary>
        //public int ZTM { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string BZ { get; set; }
        /// <summary>
        /// 设备状态标识
        /// </summary>
        public int? Mark { get; set; }
    }
}
