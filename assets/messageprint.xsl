<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:variable name='QueryResult' select='document("../../common/codelists.xml")/CodeLists/CodeList[Identification="CL401"]/CodeItem'/>
	<xsl:template match="/">
		<xsl:variable name="filteringapplied">
			<xsl:for-each select="Message/DataGroup/Filter">
				<xsl:if test="contains(.,$messageType)">
					<xsl:value-of select="'1'"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:if test="Message/Rule!='' and Message/Rule/@use=$messageType">
			<p>
				<b>Rules:</b>
				<xsl:for-each select="Message/Rule">
					<xsl:value-of select="."/>
					<xsl:if test="position() != last()">, </xsl:if>
				</xsl:for-each>
			</p>
		</xsl:if>
		<table class="table">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>Tietoryhmä/-elementti</th>
							<th>RDO</th>
							<th>Kardinaliteetti/Muoto</th>
							<th>Polku</th>
							<th>Koodisto</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>Datagrupp/-element</th>
							<th>RDO</th>
							<th>Kardinalitet/Format</th>
							<th>Sökväg</th>
							<th>Kodförteckning</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>Data group/element</th>
							<th>RDO</th>
							<th>Cardinality/Format</th>
							<th>Path</th>
							<th>Code list</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="descendant::DataGroup | descendant::DataElement">
					<xsl:choose>
						<xsl:when test="local-name()='DataGroup'">
							<xsl:if test="Use = $messageType">
								<tr>
									<xsl:attribute name="class"><xsl:value-of select="concat('indent-',count(ancestor::*)-1,' oddeven')"/></xsl:attribute>
									<td>
										<b>
											<xsl:value-of select="Name[@lang=$language]"/>
										</b>
									</td>
									<td>
										<b>
											<xsl:choose>
												<xsl:when test="Condition[@use=$messageType] != ''">D</xsl:when>
												<xsl:when test="Condition[not(@*)] != ''">D</xsl:when>
												<xsl:when test="MinOccurence[@use=$messageType]=0">O</xsl:when>
												<xsl:when test="MinOccurence[@use=$messageType]>0">R</xsl:when>
												<xsl:when test="MinOccurence[not(@*)]>0">R</xsl:when>
												<xsl:otherwise>O</xsl:otherwise>
											</xsl:choose>
										</b>
									</td>
									<td>
										<b>
											<xsl:choose>
												<xsl:when test="MaxOccurence[@use=$messageType] != ''">
													<xsl:value-of select="MaxOccurence[@use=$messageType]"/>x</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="MaxOccurence"/>x</xsl:otherwise>
											</xsl:choose>
										</b>
									</td>
									<td>
										<b>
											<xsl:value-of select="$messageType"/>
											<xsl:for-each select="ancestor-or-self::*">
												<xsl:value-of select="XPath"/>
												<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
											</xsl:for-each>
										</b>
									</td>
									<td>
									</td>
								</tr>
								<xsl:if test="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
									<tr class="description">
										<td colspan="5">
											<xsl:for-each select="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
												<xsl:value-of select="."/>
												<br/>
												<xsl:apply-templates select="."/>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
								<xsl:if test="DescriptionLine!=''">
									<tr class="description">
										<td colspan="5">
											<span class="icon icon-tulli-info" style="margin-right:3px"/>
											<xsl:for-each select="DescriptionLine[@lang=$language and not(@use)] | DescriptionLine[@lang=$language and @use=$messageType]">
												<xsl:value-of select="."/>
												<xsl:if test="position() != last()">
													<br/>
												</xsl:if>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
							</xsl:if>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="Use = $messageType">
								<tr>
									<xsl:attribute name="class"><xsl:value-of select="concat('indent-',count(ancestor::*)-1,' oddeven')"/></xsl:attribute>
									<td>
										<xsl:value-of select="Name[@lang=$language]"/>
									</td>
									<td>
										<xsl:choose>
											<xsl:when test="Condition[@use=$messageType] != ''">D</xsl:when>
											<xsl:when test="Condition[not(@*)] != ''">D</xsl:when>
											<xsl:when test="MinOccurence[@use=$messageType]=0">O</xsl:when>
											<xsl:when test="MinOccurence[@use=$messageType]>0">R</xsl:when>
											<xsl:when test="MinOccurence[not(@*)]>0">R</xsl:when>
											<xsl:otherwise>O</xsl:otherwise>
										</xsl:choose>
									</td>
									<td>
										<xsl:value-of select="Format"/>
									</td>
									<td>
										<xsl:value-of select="$messageType"/>
										<xsl:for-each select="ancestor-or-self::*">
											<xsl:value-of select="XPath"/>
											<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
										</xsl:for-each>
									</td>
									<td>
										<xsl:for-each select="Codelist">
											<xsl:value-of select="."/>
											<xsl:if test="position() != last()">, </xsl:if>
										</xsl:for-each>
									</td>
								</tr>
								<xsl:if test="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
									<tr class="description">
										<td colspan="5">
											<xsl:for-each select="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
												<xsl:value-of select="."/>
												<br/>
												<xsl:apply-templates select="."/>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
								<xsl:if test="DescriptionLine!=''">
									<tr class="description">
										<td colspan="5">
											<span class="icon icon-tulli-info" style="margin-right:3px"/>
											<xsl:for-each select="DescriptionLine[@lang=$language and not(@use)] | DescriptionLine[@lang=$language and @use=$messageType]">
												<xsl:value-of select="."/>
												<xsl:if test="position() != last()">
													<br/>
												</xsl:if>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
	<xsl:template match="Condition | Rule">
		<pre>
			<xsl:value-of select="$QueryResult[Code = current()]/Name[@lang=$language]"/>
		</pre>
	</xsl:template>
</xsl:stylesheet>
